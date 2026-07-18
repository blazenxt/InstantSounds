/**
 * Auto Scraper - Runs in background every 6 hours
 * 
 * This script automatically scrapes Myinstants and updates sounds.json
 * 
 * Usage:
 *   npm run scrape          → Run once
 *   npm run scrape:watch    → Run every 6 hours (background)
 */

import { exec } from 'child_process';

const SCRAPE_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours

function runScraper() {
  console.log(`\n[${new Date().toISOString()}] 🔄 Running background scraper...`);
  
  exec('npx tsx scripts/scraper.ts', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Scraper error:', error);
      return;
    }
    console.log(stdout);
    if (stderr) console.error(stderr);
  });
}

// Run immediately on start
runScraper();

// Then run every 6 hours
setInterval(runScraper, SCRAPE_INTERVAL);

console.log('✅ Auto-scraper started. Will run every 6 hours.');
console.log('Press Ctrl+C to stop.\n');