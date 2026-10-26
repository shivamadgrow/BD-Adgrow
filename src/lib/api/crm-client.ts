import { Business, CRMProspect, PipelineStage, ServiceType } from '@/types';

async function unwrap(res: Response): Promise<any> {
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'CRM request failed.');
  }
  return data;
}

export async function fetchProspects(): Promise<CRMProspect[]> {
  const res = await fetch('/api/crm/prospects');
  const data = await unwrap(res);
  return data.prospects;
}

export async function addBusinessToCRM(
  business: Business,
  stage: PipelineStage = 'qualified',
  servicePitched: ServiceType = 'website_development',
  dealValue: number = 1800,
  currency: 'USD' | 'INR' = 'USD'
): Promise<CRMProspect> {
  const res = await fetch('/api/crm/prospects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ business, stage, servicePitched, dealValue, currency }),
  });
  const data = await unwrap(res);
  return data.prospect;
}

export async function updateProspectStage(prospectId: string, newStage: PipelineStage): Promise<CRMProspect> {
  const res = await fetch(`/api/crm/prospects/${prospectId}/stage`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage: newStage }),
  });
  const data = await unwrap(res);
  return data.prospect;
}

export async function addProspectNote(prospectId: string, noteText: string): Promise<CRMProspect> {
  const res = await fetch(`/api/crm/prospects/${prospectId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note: noteText }),
  });
  const data = await unwrap(res);
  return data.prospect;
}

export async function toggleProspectTask(prospectId: string, taskId: string): Promise<CRMProspect> {
  const res = await fetch(`/api/crm/prospects/${prospectId}/tasks/${taskId}`, {
    method: 'PATCH',
  });
  const data = await unwrap(res);
  return data.prospect;
}
