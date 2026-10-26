import { NextRequest, NextResponse } from 'next/server';
import { updateProspectStage } from '@/lib/server/crm-repository';
import { PipelineStage } from '@/types';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { stage } = await req.json();
    if (!stage) {
      return NextResponse.json(
        { success: false, message: 'A target pipeline stage is required.' },
        { status: 400 }
      );
    }
    const prospect = await updateProspectStage(params.id, stage as PipelineStage);
    if (!prospect) {
      return NextResponse.json({ success: false, message: 'Prospect not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, prospect });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update prospect stage.' },
      { status: 500 }
    );
  }
}
