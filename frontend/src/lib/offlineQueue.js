let queue = [];

export const enqueue = (item) => {
  queue.push(item);
  if (isOnline()) {
    flush();
  }
};

export const isOnline = () => {
  return navigator.onLine !== false;
};

export const flush = async () => {
  if (!isOnline() || queue.length === 0) return;
  
  const items = [...queue];
  queue = [];
  
  for (const item of items) {
    try {
      await item.execute();
    } catch (error) {
      console.error('Failed to execute queued item:', error);
      queue.push(item);
    }
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('online', flush);
  window.addEventListener('offline', () => {
    console.log('Offline - items will be queued');
  });
}
