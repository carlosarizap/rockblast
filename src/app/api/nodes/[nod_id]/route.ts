import { NextRequest, NextResponse } from 'next/server';
import { getNodeById, updateNodeById, deleteNodeById } from '@/app/lib/actions/node-actions';

// GET /api/nodes/[nod_id] - Obtener un nodo por ID
export async function GET(req: NextRequest, { params }: { params: { nod_id: string } }) {
  try {
    const node = await getNodeById(params.nod_id);
    if (!node) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }
    return NextResponse.json(node);
  } catch (error) {
    console.error('Error fetching node:', error);
    return NextResponse.json({ error: 'Failed to fetch node' }, { status: 500 });
  }
}

// PUT /api/nodes/[nod_id] - Actualizar un nodo por ID
export async function PUT(req: NextRequest, { params }: { params: { nod_id: string } }) {
  try {
    const nodeData = await req.json();
    const success = await updateNodeById(params.nod_id, nodeData);
    if (!success) {
      return NextResponse.json({ error: 'Node not found or failed to update' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Node updated successfully' });
  } catch (error) {
    console.error('Error updating node:', error);
    return NextResponse.json({ error: 'Failed to update node' }, { status: 500 });
  }
}

// DELETE /api/nodes/[nod_id] - Eliminar un nodo por ID
export async function DELETE(req: NextRequest, { params }: { params: { nod_id: string } }) {
  try {
    const success = await deleteNodeById(params.nod_id);
    if (!success) {
      return NextResponse.json({ error: 'Node not found or failed to delete' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Node deleted successfully' });
  } catch (error) {
    console.error('Error deleting node:', error);
    return NextResponse.json({ error: 'Failed to delete node' }, { status: 500 });
  }
}
