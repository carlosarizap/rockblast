import { NextResponse } from 'next/server';
import { createUser, getAllUsers, deleteUserByRut, updateUserByRut, getUserByRut} from '@/app/lib/actions/user-actions'; // Add deleteUserByRut

// Handle GET requests to fetch all users
export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
}

// Handle POST requests to create a new user
export async function POST(req: Request) {
  try {
    const { usu_id_rut, usu_nombre, usu_apellido, usu_correo, rol_id, usu_pass, usu_estado } = await req.json();

    if (!usu_pass) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }

    const newUser = await createUser({
      usu_id_rut,
      usu_nombre,
      usu_apellido,
      usu_correo,
      rol_id,
      usu_pass,
      usu_estado: usu_estado === 'true',
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}



