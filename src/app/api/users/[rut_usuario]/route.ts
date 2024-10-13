// /src/app/api/users/[usu_id_rut]/route.ts

import { NextResponse } from 'next/server';
import { deleteUserByRut, getUserByRut, updateUserByRut } from '@/app/lib/actions/user-actions';

export async function DELETE(req: Request, { params }: { params: { rut_usuario: string } }) {
  try {
    const { rut_usuario } = params; // Extract usu_id_rut from the request parameters

    const result = await deleteUserByRut(rut_usuario);
    if (result) {
      return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
}

// Handle PUT request for updating user data
export async function PUT(req: Request, { params }: { params: { rut_usuario: string } }) {
    try {
      const userData = await req.json();
      const result = await updateUserByRut(params.rut_usuario, userData);
  
      if (result) {
        return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
      } else {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
    } catch (error) {
      return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
    }
  }

// Handle GET requests to fetch a single user by RUT
export async function GET(req: Request, { params }: { params: { rut_usuario: string } }) {
    try {

      const user = await getUserByRut(params.rut_usuario);
  
      if (user) {
        return NextResponse.json(user, { status: 200 });
      } else {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      return NextResponse.json({ message: 'Error fetching user' }, { status: 500 });
    }
  }