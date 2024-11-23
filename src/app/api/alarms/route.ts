import { NextResponse } from 'next/server';
import {
  getAllAlarms,
getAlarmById,
  createAlarm,
  updateAlarmById,
  deleteAlarmById,
} from '@/app/lib/actions/alarm-actions';
import { Alarm } from '@/app/lib/definitions/alarm';

// GET /api/alarms - Obtener todas las alarmas
export async function GET() {
  try {
    const alarms = await getAllAlarms();
    return NextResponse.json(alarms);
  } catch (error) {
    console.error('Error fetching alarms:', error);
    return NextResponse.json({ error: 'Failed to fetch alarms' }, { status: 500 });
  }
}

// POST /api/alarms - Crear una nueva alarma
export async function POST(req: Request) {
  try {
    const alarmData: Omit<Alarm, 'ale_id'> = await req.json();
    const newAlarm = await createAlarm(alarmData);
    return NextResponse.json(newAlarm, { status: 201 });
  } catch (error) {
    console.error('Error creating alarm:', error);
    return NextResponse.json({ error: 'Failed to create alarm' }, { status: 500 });
  }
}

// GET /api/alarms/[id] - Obtener una alarma por ID
export async function GET_ALARM(req: Request, { params }: { params: { id: string } }) {
  try {
    const alarm = await getAlarmById(params.id);
    if (!alarm) {
      return NextResponse.json({ error: 'Alarm not found' }, { status: 404 });
    }
    return NextResponse.json(alarm);
  } catch (error) {
    console.error('Error fetching alarm:', error);
    return NextResponse.json({ error: 'Failed to fetch alarm' }, { status: 500 });
  }
}

// PUT /api/alarms/[id] - Actualizar una alarma por ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const alarmData: Partial<Alarm> = await req.json();
    const success = await updateAlarmById(params.id, alarmData);
    if (!success) {
      return NextResponse.json({ error: 'Alarm not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Alarm updated successfully' });
  } catch (error) {
    console.error('Error updating alarm:', error);
    return NextResponse.json({ error: 'Failed to update alarm' }, { status: 500 });
  }
}

// DELETE /api/alarms/[id] - Eliminar una alarma por ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const success = await deleteAlarmById(params.id);
    if (!success) {
      return NextResponse.json({ error: 'Alarm not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Alarm deleted successfully' });
  } catch (error) {
    console.error('Error deleting alarm:', error);
    return NextResponse.json({ error: 'Failed to delete alarm' }, { status: 500 });
  }
}
