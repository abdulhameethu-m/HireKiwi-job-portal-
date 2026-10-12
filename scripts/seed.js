import { dbStore } from '../server/src/models/Store.js';

async function runSeed() {
  console.log('[Seed] Initializing and resetting database...');
  await dbStore.init(true);
  console.log('[Seed] Database successfully reseeded with deterministic test records!');
  console.log('   Users: admin@careernest.test, candidate@example.com, john.doe@example.com');
  console.log('   Jobs: 16 fictional jobs across IT, QA, DevOps, and Product');
  console.log('   Applications: Pre-seeded applications for QA Engineer and Junior Java Developer');
  process.exit(0);
}

runSeed().catch(err => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
