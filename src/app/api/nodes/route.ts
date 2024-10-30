import { NextResponse } from 'next/server';
import { getAllNodes, getNodeById, createNode, updateNodeById, deleteNodeById } from '@/app/lib/actions/node-actions';
import { Node } from '@/app/lib/definitions/node';

// GET /api/nodes - Obtener todos los nodos
export async function GET() {
  try {
    const nodes = await getAllNodes();
    return NextResponse.json(nodes);
  } catch (error) {
    console.error('Error fetching nodes:', error);
    return NextResponse.json({ error: 'Failed to fetch nodes' }, { status: 500 });
  }
}

// POST /api/nodes - Crear un nuevo nodo
export async function POST(req: Request) {
  try {
    const nodeData: Node = await req.json();
    const newNode = await createNode(nodeData);
    return NextResponse.json(newNode, { status: 201 });
  } catch (error) {
    console.error('Error creating node:', error);
    return NextResponse.json({ error: 'Failed to create node' }, { status: 500 });
  }
}

// GET /api/nodes/[id] - Obtener un nodo por ID
export async function GET_NODE(req: Request, { params }: { params: { id: string } }) {
  try {
    const node = await getNodeById(params.id);
    if (!node) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }
    return NextResponse.json(node);
  } catch (error) {
    console.error('Error fetching node:', error);
    return NextResponse.json({ error: 'Failed to fetch node' }, { status: 500 });
  }
}

// PUT /api/nodes/[id] - Actualizar un nodo por ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const nodeData: Node = await req.json();
    const success = await updateNodeById(params.id, nodeData);
    if (!success) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Node updated successfully' });
  } catch (error) {
    console.error('Error updating node:', error);
    return NextResponse.json({ error: 'Failed to update node' }, { status: 500 });
  }
}

// DELETE /api/nodes/[id] - Eliminar un nodo por ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const success = await deleteNodeById(params.id);
    if (!success) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Node deleted successfully' });
  } catch (error) {
    console.error('Error deleting node:', error);
    return NextResponse.json({ error: 'Failed to delete node' }, { status: 500 });
  }
}
