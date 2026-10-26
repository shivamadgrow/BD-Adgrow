import { NextRequest, NextResponse } from 'next/server';
import { addProspectNote } from '@/lib/server/crm-repository';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { note } = await req.json();
    if (!note || typeof note !== 'string') {
      return NextResponse.json({ success: false, message: 'Note text is required.' }, { status: 400 });
    }
    const prospect = await addProspectNote(params.id, note);
    if (!prospect) {
      return NextResponse.json({ success: false, message: 'Prospect not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, prospect });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add note.' },
      { status: 500 }
    );
  }
}
