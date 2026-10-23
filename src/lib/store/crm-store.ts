import { CRMProspect, PipelineStage, Business, CRMActivity, CRMTask, ServiceType } from '@/types';

const CRM_STORAGE_KEY = 'adgrow_crm_prospects_v1';

export function getStoredProspects(): CRMProspect[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CRM_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load CRM prospects from localStorage', e);
    return [];
  }
}

export function saveProspects(prospects: CRMProspect[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(prospects));
  } catch (e) {
    console.error('Failed to save CRM prospects', e);
  }
}

export function addBusinessToCRM(
  business: Business,
  stage: PipelineStage = 'qualified',
  servicePitched: ServiceType = 'website_development',
  dealValue: number = 1800,
  currency: 'USD' | 'INR' = 'USD'
): CRMProspect {
  const current = getStoredProspects();
  
  // Prevent duplicate additions
  const existing = current.find((p) => p.businessId === business.id);
  if (existing) {
    return existing;
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

  const updated = [newProspect, ...current];
  saveProspects(updated);
  return newProspect;
}

export function updateProspectStage(prospectId: string, newStage: PipelineStage): CRMProspect[] {
  const current = getStoredProspects();
  const updated = current.map((p) => {
    if (p.id === prospectId) {
      const activity: CRMActivity = {
        id: `act-${Date.now()}`,
        type: 'stage_change',
        description: `Pipeline stage moved from "${p.stage}" to "${newStage}"`,
        date: new Date().toISOString(),
        author: 'Sales Agent',
      };
      return {
        ...p,
        stage: newStage,
        activities: [activity, ...p.activities],
        updatedAt: new Date().toISOString(),
      };
    }
    return p;
  });
  saveProspects(updated);
  return updated;
}

export function addProspectNote(prospectId: string, noteText: string): CRMProspect[] {
  const current = getStoredProspects();
  const updated = current.map((p) => {
    if (p.id === prospectId) {
      const activity: CRMActivity = {
        id: `act-${Date.now()}`,
        type: 'note',
        description: noteText,
        date: new Date().toISOString(),
        author: 'BD Specialist',
      };
      return {
        ...p,
        notes: [noteText, ...p.notes],
        activities: [activity, ...p.activities],
        updatedAt: new Date().toISOString(),
      };
    }
    return p;
  });
  saveProspects(updated);
  return updated;
}

export function toggleProspectTask(prospectId: string, taskId: string): CRMProspect[] {
  const current = getStoredProspects();
  const updated = current.map((p) => {
    if (p.id === prospectId) {
      return {
        ...p,
        tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
        updatedAt: new Date().toISOString(),
      };
    }
    return p;
  });
  saveProspects(updated);
  return updated;
}
