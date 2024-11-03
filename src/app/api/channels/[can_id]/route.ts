import { NextRequest, NextResponse } from 'next/server';
import { getChannelById, updateChannelWithParams, deleteChannelWithParams } from '@/app/lib/actions/channel-actions';

export async function GET(request: NextRequest, { params }: { params: { can_id: string } }) {
    const { can_id } = params;
    try {
      const channelData = await getChannelById(can_id);
      if (!channelData) {
        return NextResponse.json({ message: 'Channel not found' }, { status: 404 });
      }
      return NextResponse.json(channelData);
    } catch (error) {
      console.error('Error fetching channel:', error);
      return NextResponse.json({ error: 'Failed to fetch channel' }, { status: 500 });
    }
  }

export async function PATCH(request: NextRequest, { params }: { params: { can_id: string } }) {
  const { can_id } = params;
  const data = await request.json();

  try {
    const updated = await updateChannelWithParams(can_id, data.channelData, data.parameterData);
    if (!updated) {
      return NextResponse.json({ message: 'Failed to update channel' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Channel updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update channel' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { can_id: string } }) {
  const { can_id } = params;

  try {
    const deleted = await deleteChannelWithParams(can_id);
    if (!deleted) {
      return NextResponse.json({ message: 'Failed to delete channel' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Channel deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete channel' }, { status: 500 });
  }
}
