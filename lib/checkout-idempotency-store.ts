import { promises as fs } from 'fs';
import path from 'path';

type ProcessedCheckoutRecord = {
  sessionId: string;
  eventId: string;
  printfulOrderId?: string;
  processedAt: string;
};

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'processed-checkouts.json');

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

async function readRecords(): Promise<ProcessedCheckoutRecord[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export async function isCheckoutSessionProcessed(sessionId: string) {
  const records = await readRecords();
  return records.some((record) => record.sessionId === sessionId);
}

export async function markCheckoutSessionProcessed(record: ProcessedCheckoutRecord) {
  const records = await readRecords();
  if (records.some((item) => item.sessionId === record.sessionId)) {
    return;
  }

  records.push(record);
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}
