import { NextResponse } from 'next/server';
import { getAllStatuses } from '@/app/lib/actions/node-status-actions';

// GET /api/nodes/statuses - Obtener todos los estados de los nodos
export async function GET() {
  try {
    const statuses = await getAllStatuses();
    return NextResponse.json(statuses);
  } catch (error) {
    console.error('Error fetching statuses:', error);
    return NextResponse.json({ error: 'Failed to fetch statuses' }, { status: 500 });
  }
}
