import { NextRequest, NextResponse } from 'next/server';
import { getAlarmById, updateAlarmById, deleteAlarmById } from '@/app/lib/actions/alarm-actions';

// GET /api/alarms/[ale_id] - Obtener una alarma por ID
export async function GET(req: NextRequest, { params }: { params: { ale_id: string } }) {
  try {
    const alarm = await getAlarmById(params.ale_id);
    if (!alarm) {
      return NextResponse.json({ error: 'Alarm not found' }, { status: 404 });
    }
    return NextResponse.json(alarm);
  } catch (error) {
    console.error('Error fetching alarm:', error);
    return NextResponse.json({ error: 'Failed to fetch alarm' }, { status: 500 });
  }
}

// PUT /api/alarms/[ale_id] - Actualizar una alarma por ID
export async function PUT(req: NextRequest, { params }: { params: { ale_id: string } }) {
  try {
    const alarmData = await req.json();
    const success = await updateAlarmById(params.ale_id, alarmData);
    if (!success) {
      return NextResponse.json({ error: 'Alarm not found or failed to update' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Alarm updated successfully' });
  } catch (error) {
    console.error('Error updating alarm:', error);
    return NextResponse.json({ error: 'Failed to update alarm' }, { status: 500 });
  }
}

// DELETE /api/alarms/[ale_id] - Eliminar una alarma por ID
export async function DELETE(req: NextRequest, { params }: { params: { ale_id: string } }) {
  try {
    const success = await deleteAlarmById(params.ale_id);
    if (!success) {
      return NextResponse.json({ error: 'Alarm not found or failed to delete' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Alarm deleted successfully' });
  } catch (error) {
    console.error('Error deleting alarm:', error);
    return NextResponse.json({ error: 'Failed to delete alarm' }, { status: 500 });
  }
}
