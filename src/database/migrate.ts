import { readdirSync } from 'fs';
import { join } from 'path';

async function migrate() {
  try {
    const migrationsDir = join(__dirname, 'migrations');
    const migrationFiles = readdirSync(migrationsDir)
      .filter(f => f.endsWith('.ts'))
      .sort();

    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const migration = await import(join(migrationsDir, file));
      await migration.up();
    }

    console.log('All migrations completed successfully');
  } catch (err) {
    console.error('Error during migrations:', err);
    throw err;
  }
}

migrate().catch(console.error);