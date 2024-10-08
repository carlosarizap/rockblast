import { NextResponse } from 'next/server';
import { createUser, getAllUsers, deleteUserByRut } from '@/app/lib/actions/user-actions'; // Add deleteUserByRut

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
    const { rut_usuario, nombres_usuario, apellidos_usuario, correo_usuario, id_rol_usuario, pass_usuario, estado_usuario } = await req.json();

    if (!pass_usuario) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }

    const newUser = await createUser({
      rut_usuario,
      nombres_usuario,
      apellidos_usuario,
      correo_usuario,
      id_rol_usuario,
      pass_usuario,
      estado_usuario: estado_usuario === 'true',
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}
