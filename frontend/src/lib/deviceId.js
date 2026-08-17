// Stable per-device ID until real auth exists. Generated once, stored
// locally, reused everywhere a ledger entity_id/actor is needed.
export function getDeviceId() {
  const KEY = 'agrisaathi_device_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = 'device_' + crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
