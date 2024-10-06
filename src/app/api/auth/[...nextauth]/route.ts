import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Setup your PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure your .env file has the correct DATABASE_URL
  ssl: {
    rejectUnauthorized: false, // If you're using a server with SSL
  },
});

// Define the NextAuth handler
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        rut: { label: "RUT", type: "text", placeholder: "Ingrese su RUT" }, // Updated field to accept RUT
        password: { label: "Contraseña", type: "password", placeholder: "Ingrese su contraseña" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.rut || !credentials.password) {
          throw new Error("RUT o contraseña inválidos");
        }

        const { rut, password } = credentials;

        const client = await pool.connect();
        try {
          // Fetch user from PostgreSQL using RUT instead of email
          const result = await client.query(
            "SELECT * FROM tb_usuarios WHERE rut_usuario = $1", // Query by RUT
            [rut]
          );

          if (result.rowCount === 0) {
            // If user is not found
            throw new Error("No se encontró al usuario");
          }

          const user = result.rows[0];

          // Check if the password matches
          const isValid = await bcrypt.compare(password, user.pass_usuario);

          if (!isValid) {
            throw new Error("La contraseña es incorrecta");
          }

          // Return the user object (omit sensitive info like password)
          return {
            id: user.rut_usuario,
            name: `${user.nombres_usuario} ${user.apellidos_usuario}`,
            email: user.correo_usuario, // You can still return email if needed
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
  pages: {
    signIn: "/auth/signin", // Custom login page
  },
});

// Export handlers for both GET and POST requests
export { handler as GET, handler as POST };
