import { NextResponse } from 'next/server';
import { createChannelWithParams, deleteChannelById, getAllChannels, getChannelById, updateChannelById } from '@/app/lib/actions/channel-actions';
import { Channel } from '@/app/lib/definitions/channel';
import { Parameter } from '@/app/lib/definitions/parameter';

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

// Crear un nuevo canal con sus parámetros
export async function POST(request: Request) {
  try {
    const { channelData, parameterData } = await request.json();

    // Verificar si los datos requeridos están presentes
    if (!channelData || !parameterData) {
      return NextResponse.json({ message: 'Channel data and parameter data are required' }, { status: 400 });
    }

    // Crear el canal y los parámetros
    const newChannel = await createChannelWithParams(channelData as Channel, parameterData as Parameter);
    return NextResponse.json(newChannel, { status: 201 });
  } catch (error) {
    console.error('Error creating channel:', error);
    return NextResponse.json({ message: 'Error creating channel' }, { status: 500 });
  }
}