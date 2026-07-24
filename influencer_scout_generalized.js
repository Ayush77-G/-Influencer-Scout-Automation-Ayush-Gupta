#!/usr/bin/env node
/**
 * GENERALIZED INFLUENCER SCOUT
 * 
 * Pipeline: Discover → Identify → Scout → Write to Excel
 * Supports any niche, region, follower range, and filter criteria
 * User-configurable via interactive prompts
 * 
 * LICENSE: Creative Attribution License with Community Engagement Terms
 * - Use freely for any purpose (personal, commercial, educational)
 * - MUST provide attribution to original creator
 * - MUST fork or star the GitHub repository
 * - See LICENSE file for full terms
 * 
 * ATTRIBUTION REQUIRED:
 * Built with Generalized Influencer Scout by [Creator Name]
 * Repository: [Your GitHub URL]
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { chromium } = require('playwright');
const ExcelJS = require('exceljs');

// ============================================================================
// INTERACTIVE CONFIG - USER INPUT
// ============================================================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function getUserConfig() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║    INFLUENCER SCOUT - CONFIGURATION SETUP         ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  const config = {
    // PROJECT BASICS
    projectName: await question('📌 Project Name (e.g., "Beauty Q4 2024"): '),
    niche: await question('🎯 Niche/Category (e.g., "Fashion", "Beauty", "Tech", "Fitness"): '),
    region: await question('🌍 Region/Country (e.g., "India", "USA", "Global"): '),
    
    // FOLLOWER RANGE
    followerMin: parseInt(await question('📊 Min Followers (e.g., 1000): ')) || 1000,
    followerMax: parseInt(await question('📊 Max Followers (e.g., 10000): ')) || 10000,
    
    // BRAND FOLLOWERS
    brandFollowerMin: parseInt(await question('🏢 Brand/Account Min Followers (e.g., 3000): ')) || 3000,
    
    // BATCH INFO
    batchNumber: parseInt(await question('📦 Batch Number (e.g., 1): ')) || 1,
    
    // HASHTAGS
    hashtags: [],
    
    // FILTER KEYWORDS
    positiveKeywords: [],
    noiseKeywords: [],
    brandKeywords: [],
  };

  // HASHTAGS
  console.log('\n📍 Enter hashtags (20 recommended, one per line). Type "DONE" when finished:');
  let hashtagCount = 0;
  while (hashtagCount < 20) {
    const tag = await question(`   Hashtag ${hashtagCount + 1}: `);
    if (tag.toUpperCase() === 'DONE' || tag === '') break;
    config.hashtags.push(tag.toLowerCase().replace(/^#/, ''));
    hashtagCount++;
  }

  if (config.hashtags.length === 0) {
    console.log('⚠️  No hashtags provided. Using default hashtags for Fashion.');
    config.hashtags = ['fashionblogger', 'ootd', 'styleblogger', 'fashionista', 'lookoftheday'];
  }

  // POSITIVE KEYWORDS (Influencer Filter)
  console.log('\n✅ Enter positive keywords for influencer profiles (e.g., "blogger", "creator"). Type "DONE" when finished:');
  let posCount = 0;
  while (posCount < 15) {
    const kw = await question(`   Keyword ${posCount + 1}: `);
    if (kw.toUpperCase() === 'DONE' || kw === '') break;
    config.positiveKeywords.push(kw.toLowerCase());
    posCount++;
  }

  if (config.positiveKeywords.length === 0) {
    console.log('⚠️  No positive keywords provided. Using defaults.');
    config.positiveKeywords = ['blogger', 'creator', 'influencer', 'content', niche.toLowerCase(), 'style', 'vlog'];
  }

  // NOISE KEYWORDS (Exclude)
  console.log('\n❌ Enter noise keywords to EXCLUDE profiles (e.g., "music", "gaming"). Type "DONE" when finished:');
  let noiseCount = 0;
  while (noiseCount < 15) {
    const kw = await question(`   Noise Keyword ${noiseCount + 1}: `);
    if (kw.toUpperCase() === 'DONE' || kw === '') break;
    config.noiseKeywords.push(kw.toLowerCase());
    noiseCount++;
  }

  if (config.noiseKeywords.length === 0) {
    console.log('⚠️  No noise keywords provided. Using defaults.');
    config.noiseKeywords = ['farm', 'church', 'news', 'music', 'academy', 'clinic', 'gaming', 'crypto'];
  }

  // BRAND KEYWORDS
  console.log('\n🏪 Enter brand/shop detection keywords (e.g., "shop now", "free shipping"). Type "DONE" when finished:');
  let brandCount = 0;
  while (brandCount < 15) {
    const kw = await question(`   Brand Keyword ${brandCount + 1}: `);
    if (kw.toUpperCase() === 'DONE' || kw === '') break;
    config.brandKeywords.push(kw.toLowerCase());
    brandCount++;
  }

  if (config.brandKeywords.length === 0) {
    console.log('⚠️  No brand keywords provided. Using defaults.');
    config.brandKeywords = ['shop now', 'shop our', 'free shipping', 'dm to order', 'order now', 'boutique'];
  }

  // FILE LOCATION
  const excelFile = await question('💾 Excel file path (leave blank for current dir): ');
  config.excelPath = excelFile || path.join(process.cwd(), `${config.projectName.replace(/\s+/g, '_')}_Tracker.xlsx`);

  rl.close();
  return config;
}

// ============================================================================
// FIXED CONFIG (Performance + Stability)
// ============================================================================

const FIXED_CONFIG = {
  SESSION_PATH: './instagram_session.json',
  DISCOVER_DELAY_MS: 450,
  IDENTIFY_CONCURRENCY: 1,
  IDENTIFY_DELAY_MS: 2000,
  MAX_BATCH_SIZE: 50,
  MAX_API_FETCHES: 200,
  MAX_CONSECUTIVE_429S: 3,
};

// ============================================================================
// LOGGING & FORMATTING
// ============================================================================

function log(type, message) {
  const prefix = {
    'info': '📋',
    'success': '✅',
    'error': '❌',
    'warning': '⚠️ ',
    'step': '→ ',
    'debug': '🔍',
  }[type] || '•';
  console.log(`${prefix} ${message}`);
}

// ============================================================================
// STEP 1: DISCOVER (Scrape Hashtag Pages)
// ============================================================================

async function discoverInfluencers(browser, config) {
  log('step', 'STEP 1: DISCOVER');
  log('info', `Scraping ${config.hashtags.length} hashtags...`);

  const page = await browser.newPage();
  const candidates = new Map(); // username -> { followers, name, bio }

  // Load session if exists
  if (fs.existsSync(FIXED_CONFIG.SESSION_PATH)) {
    const cookies = JSON.parse(fs.readFileSync(FIXED_CONFIG.SESSION_PATH, 'utf8'));
    await page.context().addCookies(cookies);
    log('info', 'Session loaded from disk');
  }

  for (const hashtag of config.hashtags) {
    try {
      const url = `https://www.instagram.com/explore/tags/${hashtag}/`;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });

      // Extract via API call if available
      const profiles = await page.evaluate(() => {
        try {
          // Attempt to extract from page data
          const scriptTags = Array.from(document.querySelectorAll('script'));
          let data = {};
          for (const script of scriptTags) {
            if (script.textContent.includes('edge_hashtag_to_media')) {
              data = JSON.parse(script.textContent);
              break;
            }
          }
          return data;
        } catch (e) {
          return {};
        }
      });

      if (profiles && profiles.user) {
        candidates.set(profiles.user.username, {
          followers: profiles.user.edge_followed_by?.count || 0,
          name: profiles.user.full_name || '',
          bio: profiles.user.biography || '',
        });
      }

      log('debug', `  #${hashtag} → extracted`);
      await page.waitForTimeout(FIXED_CONFIG.DISCOVER_DELAY_MS);
    } catch (err) {
      log('warning', `  #${hashtag} → failed (${err.message})`);
    }
  }

  await page.close();
  log('success', `Discovered ${candidates.size} candidates`);
  return candidates;
}

// ============================================================================
// STEP 2: IDENTIFY (Fetch Full Profile Data)
// ============================================================================

async function identifyProfiles(browser, config, candidates) {
  log('step', 'STEP 2: IDENTIFY');
  log('info', `Enriching ${candidates.size} profiles...`);

  const page = await browser.newPage();
  const enriched = new Map(candidates); // Start with cached data
  let apiFetches = 0;
  let consecutiveFails = 0;

  for (const [username, data] of candidates) {
    if (apiFetches >= FIXED_CONFIG.MAX_API_FETCHES) {
      log('warning', 'Hit API fetch limit, using cached data');
      break;
    }

    if (data.followers && data.followers > 0) {
      continue; // Already has data
    }

    try {
      const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 5000 });

      if (response.status() === 429) {
        consecutiveFails++;
        if (consecutiveFails >= FIXED_CONFIG.MAX_CONSECUTIVE_429S) {
          log('warning', 'Rate limited, stopping API fetches');
          break;
        }
        const backoff = [10000, 20000, 30000, 40000][Math.min(consecutiveFails - 1, 3)];
        log('warning', `Rate limited (429), backing off ${backoff}ms`);
        await page.waitForTimeout(backoff);
        continue;
      }

      consecutiveFails = 0;
      const json = await response.json().catch(() => ({}));
      const user = json?.data?.user;

      if (user) {
        enriched.set(username, {
          followers: user.edge_followed_by?.count || 0,
          name: user.full_name || user.username,
          bio: user.biography || '',
        });
        apiFetches++;
      }

      await page.waitForTimeout(FIXED_CONFIG.IDENTIFY_DELAY_MS);
    } catch (err) {
      log('debug', `  ${username} → skipped (${err.message})`);
    }
  }

  await page.close();
  log('success', `Enriched ${apiFetches} profiles via API`);
  return enriched;
}

// ============================================================================
// STEP 3: SCOUT (Quality Filtering)
// ============================================================================

async function scoutInfluencers(config, profiles, existingHandles) {
  log('step', 'STEP 3: SCOUT');

  const influencers = [];
  const brands = [];
  const filtered = { noise: 0, brand_small: 0, no_keywords: 0, dedup: 0 };

  for (const [username, data] of profiles) {
    const { followers, name, bio } = data;
    const text = `${name || ''} ${bio || ''} ${username}`.toLowerCase();

    // A. Dedup
    if (existingHandles.has(username)) {
      filtered.dedup++;
      continue;
    }

    // B. Noise Filter
    if (config.noiseKeywords.some(kw => text.includes(kw))) {
      filtered.noise++;
      continue;
    }

    // C. Brand Detection
    const isBrand = config.brandKeywords.some(kw => text.includes(kw));
    if (isBrand) {
      if (followers >= config.brandFollowerMin) {
        brands.push({ username, name, followers, bio });
      } else {
        filtered.brand_small++;
      }
      continue;
    }

    // D. Positive Filter
    const hasKeyword = config.positiveKeywords.some(kw => text.includes(kw));
    if (!hasKeyword) {
      filtered.no_keywords++;
      continue;
    }

    // E. Follower Range
    if (followers < config.followerMin || followers > config.followerMax) {
      continue;
    }

    influencers.push({ username, name, followers, bio });
  }

  // F. Sort & Cap
  influencers.sort((a, b) => b.followers - a.followers);
  const topInfluencers = influencers.slice(0, FIXED_CONFIG.MAX_BATCH_SIZE);

  brands.sort((a, b) => b.followers - a.followers);

  log('success', `Scouted ${topInfluencers.length} influencers, ${brands.length} brands`);
  log('debug', `  Filtered: noise=${filtered.noise}, brand_small=${filtered.brand_small}, no_keywords=${filtered.no_keywords}, dedup=${filtered.dedup}`);

  return { influencers: topInfluencers, brands };
}

// ============================================================================
// STEP 4: WRITE TO EXCEL
// ============================================================================

function getInfluencerTier(followers) {
  if (followers <= 10000) return 'Nano (1K-10K)';
  if (followers <= 100000) return 'Micro (10K-100K)';
  return 'Macro (100K+)';
}

function getBrandTier(followers) {
  if (followers < 10000) return 'Nano Brand (<10K)';
  if (followers <= 30000) return 'Small Brand (10K-30K)';
  if (followers <= 100000) return 'Macro (30K-100K)';
  return 'Mega (100K+)';
}

function getEstimatedFee(followers) {
  if (followers < 10000) return '₹3,000–₹8,000';
  if (followers <= 30000) return '₹5,000–₹15,000';
  if (followers <= 100000) return '₹15,000–₹40,000';
  return '₹40,000–₹1,00,000';
}

function getPriority(followers) {
  if (followers < 10000) return 'LOW';
  if (followers <= 30000) return 'MED';
  return 'HIGH';
}

async function writeToExcel(config, influencers, brands) {
  log('step', 'STEP 4: WRITE TO EXCEL');

  let workbook;
  let influencerSheet, brandSheet;

  // Load existing or create new
  if (fs.existsSync(config.excelPath)) {
    workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(config.excelPath);
    influencerSheet = workbook.getWorksheet('Influencer Prospects') || 
                      workbook.addWorksheet('Influencer Prospects');
    brandSheet = workbook.getWorksheet('Brand & Macro Prospects') || 
                 workbook.addWorksheet('Brand & Macro Prospects');
    log('info', 'Loaded existing workbook');
  } else {
    workbook = new ExcelJS.Workbook();
    influencerSheet = workbook.addWorksheet('Influencer Prospects');
    brandSheet = workbook.addWorksheet('Brand & Macro Prospects');
    
    // Create headers
    influencerSheet.columns = [
      { header: 'Handle', key: 'handle', width: 18 },
      { header: 'Name', key: 'name', width: 18 },
      { header: 'Profile URL', key: 'url', width: 30 },
      { header: 'Followers', key: 'followers', width: 12 },
      { header: 'Tier', key: 'tier', width: 18 },
      { header: 'Niche/Content Type', key: 'niche', width: 20 },
      { header: 'Has Brand Collabs?', key: 'collabs', width: 15 },
      { header: 'Contact Email', key: 'email', width: 20 },
      { header: 'Found Via', key: 'foundVia', width: 15 },
      { header: 'Location', key: 'location', width: 15 },
      { header: 'Outreach Status', key: 'status', width: 15 },
      { header: 'DM Sent Date', key: 'dmDate', width: 12 },
      { header: 'Response', key: 'response', width: 15 },
      { header: 'Notes', key: 'notes', width: 25 },
    ];

    brandSheet.columns = [
      { header: 'Handle', key: 'handle', width: 18 },
      { header: 'Name', key: 'name', width: 18 },
      { header: 'Profile URL', key: 'url', width: 30 },
      { header: 'Followers', key: 'followers', width: 12 },
      { header: 'Tier', key: 'tier', width: 18 },
      { header: 'Niche/Content Type', key: 'niche', width: 20 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Has Brand Collabs?', key: 'collabs', width: 15 },
      { header: 'Contact Email', key: 'email', width: 20 },
      { header: 'DM Sent?', key: 'dmSent', width: 12 },
      { header: 'Notes', key: 'notes', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Priority', key: 'priority', width: 12 },
      { header: 'Est. Fee (INR)', key: 'fee', width: 15 },
      { header: 'Hashtags Used', key: 'hashtags', width: 20 },
    ];

    log('info', 'Created new workbook');
  }

  // Add influencer rows
  const foundViaHashtags = config.hashtags.slice(0, 3).join(', ');
  for (const inf of influencers) {
    influencerSheet.addRow({
      handle: inf.username,
      name: inf.name || '—',
      url: `https://instagram.com/${inf.username}`,
      followers: inf.followers,
      tier: getInfluencerTier(inf.followers),
      niche: config.niche + ' / Style',
      collabs: 'Unknown',
      email: '—',
      foundVia: foundViaHashtags,
      location: config.region,
      status: 'Not Contacted',
      dmDate: '—',
      response: '—',
      notes: `Batch ${config.batchNumber} — auto-scouted`,
    });
  }

  // Add hyperlinks to influencer URLs
  const inflRowStart = 2; // after header
  for (let i = 0; i < influencers.length; i++) {
    const cell = influencerSheet.getCell(`C${inflRowStart + i}`);
    cell.value = {
      text: `https://instagram.com/${influencers[i].username}`,
      hyperlink: `https://instagram.com/${influencers[i].username}`,
    };
    cell.font = { color: { theme: 10 }, underline: 'single' };
  }

  // Add brand rows
  for (const brand of brands) {
    brandSheet.addRow({
      handle: brand.username,
      name: brand.name || '—',
      url: `https://instagram.com/${brand.username}`,
      followers: brand.followers,
      tier: getBrandTier(brand.followers),
      niche: config.niche + ' / Brand',
      category: 'D2C / Brand',
      collabs: 'Unknown',
      email: '—',
      dmSent: 'No',
      notes: `Batch ${config.batchNumber} — auto-scouted`,
      status: 'Pending',
      priority: getPriority(brand.followers),
      fee: getEstimatedFee(brand.followers),
      hashtags: foundViaHashtags,
    });
  }

  // Add hyperlinks to brand URLs
  const brandRowStart = 2;
  for (let i = 0; i < brands.length; i++) {
    const cell = brandSheet.getCell(`C${brandRowStart + i}`);
    cell.value = {
      text: `https://instagram.com/${brands[i].username}`,
      hyperlink: `https://instagram.com/${brands[i].username}`,
    };
    cell.font = { color: { theme: 10 }, underline: 'single' };
  }

  await workbook.xlsx.writeFile(config.excelPath);
  log('success', `✓ Influencers: ${influencers.length} rows`);
  log('success', `✓ Brands: ${brands.length} rows`);
  log('success', `✓ File saved to: ${config.excelPath}`);
}

// ============================================================================
// DEDUP: Load existing handles
// ============================================================================

async function loadExistingHandles(filePath) {
  const handles = new Set();

  if (!fs.existsSync(filePath)) {
    return handles;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    for (const sheet of workbook.worksheets) {
      sheet.eachRow((row, rowNum) => {
        if (rowNum > 1 && row.values[1]) {
          handles.add(row.values[1]); // Handle is column 1
        }
      });
    }

    log('info', `Loaded ${handles.size} existing handles for dedup`);
  } catch (err) {
    log('warning', `Could not load existing file: ${err.message}`);
  }

  return handles;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  try {
    const config = await getUserConfig();

    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║             PIPELINE STARTING                      ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    log('info', `Project: ${config.projectName}`);
    log('info', `Niche: ${config.niche} | Region: ${config.region}`);
    log('info', `Followers: ${config.followerMin}–${config.followerMax}`);
    log('info', `Hashtags: ${config.hashtags.join(', ')}`);

    const browser = await chromium.launch({ headless: false });

    // Load existing handles for dedup
    const existingHandles = await loadExistingHandles(config.excelPath);

    // DISCOVER
    const candidates = await discoverInfluencers(browser, config);

    // IDENTIFY
    const enriched = await identifyProfiles(browser, config, candidates);

    // SCOUT
    const { influencers, brands } = await scoutInfluencers(config, enriched, existingHandles);

    // WRITE
    await writeToExcel(config, influencers, brands);

    await browser.close();

    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║             ✅ COMPLETE                             ║');
    console.log('╚════════════════════════════════════════════════════╝\n');
  } catch (error) {
    log('error', `Fatal error: ${error.message}`);
    process.exit(1);
  }
}

main();
