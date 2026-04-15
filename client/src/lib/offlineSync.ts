import { get, set } from 'idb-keyval';
import axios from 'axios';

interface QueuedTransaction {
  id: string;
  payload: any;
  timestamp: number;
}

const SYNC_QUEUE_KEY = 'offline-transaction-queue';

export const queueTransaction = async (payload: any) => {
  const queue: QueuedTransaction[] = (await get(SYNC_QUEUE_KEY)) || [];
  queue.push({
    id: crypto.randomUUID(),
    payload,
    timestamp: Date.now()
  });
  await set(SYNC_QUEUE_KEY, queue);
  console.log(`[OfflineSync] Queued transaction. Total pending: ${queue.length}`);
};

export const syncOfflineTransactions = async () => {
  if (!navigator.onLine) return; // double check

  const queue: QueuedTransaction[] = (await get(SYNC_QUEUE_KEY)) || [];
  if (queue.length === 0) return;

  console.log(`[OfflineSync] Network restored. Syncing ${queue.length} pending transactions...`);

  const failedItems: QueuedTransaction[] = [];
  
  for (const item of queue) {
    try {
      await axios.post('/api/orders', item.payload, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      console.log(`[OfflineSync] Transaction ${item.id} persisted to cloud.`);
    } catch (err) {
      console.error(`[OfflineSync] Failed to sync ${item.id}`, err);
      failedItems.push(item);
    }
  }

  // Update queue to only retain the ones that failed
  await set(SYNC_QUEUE_KEY, failedItems);
};

// Global Listener Initialization
export const initOfflineSyncListeners = () => {
  window.addEventListener('online', () => {
    syncOfflineTransactions();
  });
};
