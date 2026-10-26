import { getDb } from '@/lib/db/mongodb';
import { Business, CRMProspect, PipelineStage, CRMActivity, ServiceType } from '@/types';

const COLLECTION = 'crmProspects';
const PROJECT_OUT_ID = { projection: { _id: 0 } } as const;

async function getCollection() {
  const db = await getDb();
  return db.collection<CRMProspect>(COLLECTION);
}

export async function getAllProspects(): Promise<CRMProspect[]> {
  const col = await getCollection();
  return col.find({}, PROJECT_OUT_ID).sort({ createdAt: -1 }).toArray() as Promise<CRMProspect[]>;
}

export async function addBusinessToCRM(
  business: Business,
  stage: PipelineStage = 'qualified',
  servicePitched: ServiceType = 'website_development',
  dealValue: number = 1800,
  currency: 'USD' | 'INR' = 'USD'
): Promise<CRMProspect> {
  const col = await getCollection();
  const existing = (await col.findOne({ businessId: business.id }, PROJECT_OUT_ID)) as CRMProspect | null;

  if (existing) {
    const updated: CRMProspect = {
      ...existing,
      stage,
      servicePitched,
      estimatedDealValue: dealValue,
      currency,
      updatedAt: new Date().toISOString(),
    };
    await col.updateOne({ businessId: business.id }, { $set: updated });
    return updated;
  }

  const newProspect: CRMProspect = {
    id: `crm-${business.id}-${Date.now()}`,
    businessId: business.id,
    business,
    stage,
    priority: business.score.priority,
    estimatedDealValue: dealValue,
    currency,
    servicePitched,
    assignedTo: 'Vikram Sethi (Senior BD)',
    notes: [`Discovered via Ad Grow BD Global Intelligence. Opportunity score: ${business.score.totalScore}/100.`],
    activities: [
      {
        id: `act-${Date.now()}`,
        type: 'stage_change',
        description: `Prospect qualified and imported into CRM under stage "${stage}".`,
        date: new Date().toISOString(),
        author: 'System Agent',
      },
    ],
    tasks: [
      {
        id: `tsk-${Date.now()}`,
        title: `Conduct initial outreach using tailored ${business.category} pitch draft`,
        dueDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0],
        completed: false,
        priority: 'high',
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await col.insertOne(newProspect);
  return newProspect;
}

export async function updateProspectStage(
  prospectId: string,
  newStage: PipelineStage
): Promise<CRMProspect | null> {
  const col = await getCollection();
  const existing = (await col.findOne({ id: prospectId }, PROJECT_OUT_ID)) as CRMProspect | null;
  if (!existing) return null;

  const activity: CRMActivity = {
    id: `act-${Date.now()}`,
    type: 'stage_change',
    description: `Pipeline stage moved from "${existing.stage}" to "${newStage}"`,
    date: new Date().toISOString(),
    author: 'Sales Agent',
  };

  const updated: CRMProspect = {
    ...existing,
    stage: newStage,
    activities: [activity, ...existing.activities],
    updatedAt: new Date().toISOString(),
  };

  await col.updateOne({ id: prospectId }, { $set: updated });
  return updated;
}

export async function addProspectNote(prospectId: string, noteText: string): Promise<CRMProspect | null> {
  const col = await getCollection();
  const existing = (await col.findOne({ id: prospectId }, PROJECT_OUT_ID)) as CRMProspect | null;
  if (!existing) return null;

  const activity: CRMActivity = {
    id: `act-${Date.now()}`,
    type: 'note',
    description: noteText,
    date: new Date().toISOString(),
    author: 'BD Specialist',
  };

  const updated: CRMProspect = {
    ...existing,
    notes: [noteText, ...existing.notes],
    activities: [activity, ...existing.activities],
    updatedAt: new Date().toISOString(),
  };

  await col.updateOne({ id: prospectId }, { $set: updated });
  return updated;
}

export async function toggleProspectTask(prospectId: string, taskId: string): Promise<CRMProspect | null> {
  const col = await getCollection();
  const existing = (await col.findOne({ id: prospectId }, PROJECT_OUT_ID)) as CRMProspect | null;
  if (!existing) return null;

  const updated: CRMProspect = {
    ...existing,
    tasks: existing.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
    updatedAt: new Date().toISOString(),
  };

  await col.updateOne({ id: prospectId }, { $set: updated });
  return updated;
}
