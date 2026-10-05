/**
 * Run Mind Profile Migrations
 * Executes migrations for scenarios, quiz_sessions, and quiz_responses tables
 */

import { query } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrations = [
  '034_create_scenarios_table.sql',
  '035_create_quiz_sessions_table.sql',
  '036_create_quiz_responses_table.sql'
];

async function runMigrations() {
  console.log('🚀 Starting Mind Profile migrations...\n');

  for (const migration of migrations) {
    try {
      console.log(`📝 Running migration: ${migration}`);
      
      const migrationPath = path.join(__dirname, 'migrations', migration);
      const sql = fs.readFileSync(migrationPath, 'utf8');
      
      await query(sql);
      
      console.log(`✅ Successfully executed: ${migration}\n`);
    } catch (error) {
      console.error(`❌ Error running migration ${migration}:`, error.message);
      throw error;
    }
  }

  console.log('🎉 All Mind Profile migrations completed successfully!');
}

// Run migrations
runMigrations()
  .then(() => {
    console.log('\n✨ Database is ready for Mind Profile feature');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });
