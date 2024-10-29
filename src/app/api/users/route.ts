import { NextResponse } from 'next/server';
import { createUser, getAllUsers } from '@/app/lib/actions/user-actions';

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
    // Parse the JSON body
    const body = await req.json(); // Correct way to parse body
    const { usu_id_rut, usu_nombre, usu_apellido, usu_correo, rol_id, usu_pass, usu_estado } = body;

    // Validate required fields
    if (!usu_pass) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }

    // Create the new user
    const newUser = await createUser({
      usu_id_rut,
      usu_nombre,
      usu_apellido,
      usu_correo,
      rol_id,
      usu_pass,
      usu_estado: usu_estado === 'true', // Convert string 'true' to boolean true
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}
