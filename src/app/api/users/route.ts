import { NextResponse } from 'next/server';
import { getAllUsers } from '@/app/lib/actions/user-actions'; // Correct path to user-actions

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
}
