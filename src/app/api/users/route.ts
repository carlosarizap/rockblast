import { NextResponse } from 'next/server';
<<<<<<< HEAD
import { createUser, getAllUsers, deleteUserByRut, updateUserByRut, getUserByRut} from '@/app/lib/actions/user-actions'; // Add deleteUserByRut
=======
import { createUser, getAllUsers } from '@/app/lib/actions/user-actions';
>>>>>>> ab8a859c561150266ef579243a71d6784f584035

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
<<<<<<< HEAD
    const { usu_id_rut, usu_nombre, usu_apellido, usu_correo, rol_id, usu_pass, usu_estado } = await req.json();

=======
    // Parse the JSON body
    const body = await req.json(); // Correct way to parse body
    const { usu_id_rut, usu_nombre, usu_apellido, usu_correo, rol_id, usu_pass, usu_estado } = body;

    // Validate required fields
>>>>>>> ab8a859c561150266ef579243a71d6784f584035
    if (!usu_pass) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }

<<<<<<< HEAD
=======
    // Create the new user
>>>>>>> ab8a859c561150266ef579243a71d6784f584035
    const newUser = await createUser({
      usu_id_rut,
      usu_nombre,
      usu_apellido,
      usu_correo,
      rol_id,
      usu_pass,
<<<<<<< HEAD
      usu_estado: usu_estado === 'true',
=======
      usu_estado: usu_estado === 'true', // Convert string 'true' to boolean true
>>>>>>> ab8a859c561150266ef579243a71d6784f584035
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}
<<<<<<< HEAD



=======
>>>>>>> ab8a859c561150266ef579243a71d6784f584035
