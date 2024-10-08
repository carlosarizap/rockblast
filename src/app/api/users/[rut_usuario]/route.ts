// /src/app/api/users/[rut_usuario]/route.ts

import { NextResponse } from 'next/server';
import { deleteUserByRut } from '@/app/lib/actions/user-actions';

export async function DELETE(req: Request, { params }: { params: { rut_usuario: string } }) {
  try {
    const { rut_usuario } = params; // Extract rut_usuario from the request parameters

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
