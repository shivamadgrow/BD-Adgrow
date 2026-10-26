import { NextRequest, NextResponse } from 'next/server';
import { addBusinessToCRM, getAllProspects } from '@/lib/server/crm-repository';

export async function GET() {
  try {
    const prospects = await getAllProspects();
    return NextResponse.json({ success: true, prospects });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to load CRM prospects.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { business, stage, servicePitched, dealValue, currency } = await req.json();
    if (!business?.id) {
      return NextResponse.json(
        { success: false, message: 'A valid business object is required.' },
        { status: 400 }
      );
    }
    const prospect = await addBusinessToCRM(business, stage, servicePitched, dealValue, currency);
    return NextResponse.json({ success: true, prospect });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add business to CRM.' },
      { status: 500 }
    );
  }
}
