import { NextRequest, NextResponse } from 'next/server';
import { toggleProspectTask } from '@/lib/server/crm-repository';

export async function PATCH(_req: NextRequest, { params }: { params: { id: string; taskId: string } }) {
  try {
    const prospect = await toggleProspectTask(params.id, params.taskId);
    if (!prospect) {
      return NextResponse.json({ success: false, message: 'Prospect or task not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, prospect });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to toggle task.' },
      { status: 500 }
    );
  }
}
