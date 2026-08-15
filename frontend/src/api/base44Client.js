import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const STORAGE_PREFIX = 'agrisaathi_entity_';

// ---- generic localStorage-backed entity store ----
// Mimics the Base44 SDK shape (list/get/create/update/delete/filter) so
// existing page code (base44.entities.X.list(...)) keeps working unchanged,
// even though there's no matching backend route for X yet.

function readStore(entityName) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + entityName);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStore(entityName, records) {
  localStorage.setItem(STORAGE_PREFIX + entityName, JSON.stringify(records));
}

function makeId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function createEntity(entityName) {
  return {
    // list(sortField, limit) — matches how pages call e.g. .list('name', 50)
    list: async (_sortField, limit) => {
      const records = readStore(entityName);
      return typeof limit === 'number' ? records.slice(0, limit) : records;
    },

    // filter(queryObj) — simple equality matching against stored records
    filter: async (query = {}) => {
      const records = readStore(entityName);
      return records.filter((r) =>
        Object.entries(query).every(([k, v]) => r[k] === v)
      );
    },

    get: async (id) => {
      const records = readStore(entityName);
      return records.find((r) => r.id === id) || null;
    },

    create: async (data) => {
      const records = readStore(entityName);
      const record = { id: makeId(), ...data, created_at: new Date().toISOString() };
      records.push(record);
      writeStore(entityName, records);
      return record;
    },

    update: async (id, data) => {
      const records = readStore(entityName);
      const idx = records.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      records[idx] = { ...records[idx], ...data, updated_at: new Date().toISOString() };
      writeStore(entityName, records);
      return records[idx];
    },

    delete: async (id) => {
      const records = readStore(entityName);
      const filtered = records.filter((r) => r.id !== id);
      writeStore(entityName, filtered);
      return true;
    },
  };
}

// Proxy so ANY entity name works without listing all 23 explicitly —
// covers Crop, Farm, GovLoan, GovMarket, GovScheme, KVK, SoilRecord,
// TrainingResource, InsurancePolicy, FarmTask, etc. automatically.
const entitiesProxy = new Proxy(
  {},
  {
    get: (_target, entityName) => createEntity(String(entityName)),
  }
);

export const base44 = {
  entities: entitiesProxy,

  createClient: (options = {}) => {
    return axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  },

  call: async (endpoint, options = {}) => {
    const client = base44.createClient();
    try {
      const response = await client({
        url: endpoint,
        method: options.method || 'GET',
        data: options.data,
        params: options.params,
        ...options,
      });
      return response.data;
    } catch (error) {
      console.error('API Call Error:', error);
      throw error;
    }
  },

  integrations: {
    Core: {
      InvokeLLM: async (params) => {
        if (params.prompt && params.prompt.includes('plant disease')) {
          try {
            const response = await base44.call('/api/diagnosis/analyze', {
              method: 'POST',
              data: params,
            });
            return response;
          } catch (error) {
            console.error('LLM Invoke Error:', error);
            return { status: 'error', reason: 'Failed to analyze' };
          }
        }
        return { status: 'partial', reason: 'LLM service not configured' };
      },
    },
  },
};

export default base44;
