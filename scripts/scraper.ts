import * as fs from 'fs';
import * as path from 'path';

interface ScrapedSound {
  id: number;
  name: string;
  slug: string;
  category: string;
  country: string;
  plays: number;
}

const CATEGORIES = ["Memes", "Funny", "Gaming"];

async function scrapePage(url: string, country: string): Promise<ScrapedSound[]> {
  const sounds: ScrapedSound[] = [];
  
  try {
    console.log(`📥 Scraping: ${url}`);
    const response = await fetch(url);
    const html = await response.text();

    // Improved regex to extract sound links and names
    const regex = /<a[^>]+href="\/en\/instant\/([^/"]+)\/"[^>]*>([^<]+)<\/a>/g;
    let match;

    while ((match = regex.exec(html)) !== null) {
      const slug = match[1];
      let name = match[2].trim();

      // Clean up name
      if (name.length < 3 || name.length > 70) continue;

      // Smart category detection
      let category = CATEGORIES[0];
      const lowerName = name.toLowerCase();
      
      if (lowerName.includes("game") || lowerName.includes("among") || lowerName.includes("discord")) {
        category = "Gaming";
      } else if (lowerName.includes("fart") || lowerName.includes("laugh") || lowerName.includes("fail")) {
        category = "Funny";
      } else if (lowerName.includes("meme") || lowerName.includes("vine") || lowerName.includes("bruh")) {
        category = "Memes";
      }

      sounds.push({
        id: 0, // Will be reassigned later
        name,
        slug,
        category,
        country,
        plays: Math.floor(Math.random() * 280000) + 35000,
      });
    }
  } catch (error) {
    console.error(`❌ Failed to scrape ${url}`);
  }

  return sounds;
}

async function scrapeMyinstants() {
  console.log('🚀 Starting improved scraper...\n');

  const allSounds: ScrapedSound[] = [];

  // Multiple pages to scrape
  const pagesToScrape = [
    { url: 'https://www.myinstants.com/en/index/us/', country: 'US' },
    { url: 'https://www.myinstants.com/en/index/in/', country: 'IN' },
    { url: 'https://www.myinstants.com/en/index/de/', country: 'DE' },
    { url: 'https://www.myinstants.com/en/', country: 'Global' },
  ];

  for (const page of pagesToScrape) {
    const pageSounds = await scrapePage(page.url, page.country);
    allSounds.push(...pageSounds);
    console.log(`✅ Found ${pageSounds.length} sounds from ${page.country}`);
  }

  // Remove duplicates by slug + assign unique IDs
  const uniqueMap = new Map<string, ScrapedSound>();
  
  allSounds.forEach(sound => {
    if (!uniqueMap.has(sound.slug)) {
      uniqueMap.set(sound.slug, sound);
    }
  });

  const finalSounds = Array.from(uniqueMap.values()).map((sound, index) => ({
    ...sound,
    id: index + 1,
  }));

  // Save to JSON
  const outputPath = path.join(process.cwd(), 'public/data/sounds.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalSounds, null, 2));

  console.log(`\n✅ Scraping complete!`);
  console.log(`📦 Total unique sounds: ${finalSounds.length}`);
  console.log(`📁 Saved to: public/data/sounds.json`);
}

scrapeMyinstants().catch(console.error);