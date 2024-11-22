import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { config } from '../config';

const execAsync = promisify(exec);

export async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = join(__dirname, '../../backups', `backup-${timestamp}.sql`);

  const command = `mysqldump -h ${config.db.host} -P ${config.db.port} -u ${config.db.user} -p${config.db.password} ${config.db.name} > ${backupPath}`;

  try {
    await execAsync(command);
    console.log(`Backup created successfully at ${backupPath}`);
    return backupPath;
  } catch (err) {
    console.error('Error creating backup:', err);
    throw err;
  }
}

export async function restoreBackup(backupPath: string) {
  const command = `mysql -h ${config.db.host} -P ${config.db.port} -u ${config.db.user} -p${config.db.password} ${config.db.name} < ${backupPath}`;

  try {
    await execAsync(command);
    console.log('Backup restored successfully');
  } catch (err) {
    console.error('Error restoring backup:', err);
    throw err;
  }
}