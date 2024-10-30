import { NextResponse } from 'next/server';
import { createChannelWithParams, deleteChannelById, getAllChannels, getChannelById, updateChannelById } from '@/app/lib/actions/channel-actions';

// Obtener todos los canales
export async function GET(request: Request) {
  try {
    const channels = await getAllChannels();
    return NextResponse.json(channels);
  } catch (error) {
    console.error('Error fetching channels:', error);
    return NextResponse.json({ message: 'Error fetching channels' }, { status: 500 });
  }
}

