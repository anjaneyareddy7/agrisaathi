import { base44 } from '../api/base44Client';

const KEY = 'agri_offline_queue';
const listeners = new Set();

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function write(q) {
  try { localStorage.setItem(KEY, JSON.stringify(q)); } catch { return false; }
  notify();
  return true;
}
function notify() { listeners.forEach((fn) => fn(read())); }

export const getPending = () => read();
export const isOnline = () => (typeof navigator !== 'undefined' ? navigator.onLine : true);
export const subscribe = (fn) => { listeners.add(fn); fn(read()); return () => listeners.delete(fn); };

export function enqueue(op) {
  const q = read();
  q.push({ ...op, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, queued_at: new Date().toISOString() });
  return write(q);
}

export function remove(id) {
  write(read().filter((x) => x.id !== id));
}

function dataURLtoFile(dataURL, name) {
  const [meta, b64] = dataURL.split(',');
  const mime = meta.match(/:(.*?);/)[1];
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new File([arr], name, { type: mime });
}

async function runDiagnose(item) {
  let image_url;
  if (item.photoDataUrl) {
    const { file_url } = await base44.integrations.Core.UploadFile({ file: dataURLtoFile(item.photoDataUrl, 'photo.jpg') });
    image_url = file_url;
  }
  const res = await base44.integrations.Core.InvokeLLM({
    prompt: item.prompt,
    file_urls: image_url ? [image_url] : undefined,
    response_json_schema: item.schema,
  });
  await base44.entities.Diagnosis.create({
    ...item.record,
    image_url,
    likely_issue: res.likely_issue,
    alternatives: res.alternatives,
    confidence: res.confidence,
    evidence: res.evidence,
    organic_treatment: res.organic_treatment,
    chemical_treatment: res.chemical_treatment,
    precautions: res.precautions,
    escalate: res.escalate,
    escalation_note: res.escalation_note,
  });
}

let flushing = false;
export async function flush() {
  if (flushing || !isOnline()) return;
  flushing = true;
  const q = read();
  const remaining = [];
  for (const item of q) {
    try {
      if (item.type === 'create') {
        await base44.entities[item.entity].bulkCreate(item.records);
      } else if (item.type === 'diagnose') {
        await runDiagnose(item);
      }
    } catch (e) {
      remaining.push(item);
    }
  }
  write(remaining);
  flushing = false;
  return remaining.length;
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { flush(); });
}
