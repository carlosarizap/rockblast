import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Setup your PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Define the NextAuth handler
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        rut: { label: "RUT", type: "text", placeholder: "Ingrese su RUT" },
        password: { label: "Contraseña", type: "password", placeholder: "Ingrese su contraseña" },
      },
      async authorize(credentials) {
        if (!credentials?.rut || !credentials.password) {
          throw new Error("RUT o contraseña inválidos");
        }

        const { rut, password } = credentials;

        const client = await pool.connect();
        try {
          const result = await client.query(
            `SELECT u.*, r.rol_nombre 
             FROM tb_usuario u
             JOIN tb_roles r ON u.rol_id = r.rol_id
             WHERE u.usu_id_rut = $1`,
            [rut]
          );

          if (result.rowCount === 0) {
            throw new Error("No se encontró al usuario");
          }

          const user = result.rows[0];
          const isValid = await bcrypt.compare(password, user.usu_pass);

          if (!isValid) {
            throw new Error("La contraseña es incorrecta");
          }

          return {
            id: user.usu_id_rut,
            name: `${user.usu_nombre} ${user.usu_apellido}`,
            email: user.usu_correo,
            role: user.rol_nombre, // Include role
            image: user.usu_foto_perfil,
          };
        } finally {
          client.release();
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for session handling
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // Add role from token
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Persist role in token
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin", // Custom login page
  },
});

// Export handlers for both GET and POST requests
export { handler as GET, handler as POST };
