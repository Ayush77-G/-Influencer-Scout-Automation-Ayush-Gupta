# Generalized Influencer Scout — Setup & Usage Guide

## 🎯 Key Capabilities

This **Generalized Influencer Scout** allows you to:

✅ **Choose any niche** — Fashion, Beauty, Tech, Gaming, Fitness, Food, Travel, etc.  
✅ **Set any follower range** — 500–100K, micro, macro, whatever you need  
✅ **Define your own filters** — Positive keywords, noise filters, brand detection keywords  
✅ **Target any region** — India, USA, Europe, Global, etc.  
✅ **Interactive setup** — No code editing needed. Answer 5-minute prompts, then run.  

**Pipeline remains the same:**
```
DISCOVER (scrape hashtags) → IDENTIFY (fetch profiles) → SCOUT (filter) → WRITE (Excel)
```

---

## 📋 Prerequisites

```bash
# Node.js (v16+)
node --version

# Install dependencies
npm install playwright exceljs

# Install Chromium browser
npx playwright install chromium

# Make script executable (optional)
chmod +x influencer_scout_generalized.js
```

---

## 🚀 Quick Start

### 1️⃣ Run the Script

```bash
node influencer_scout_generalized.js
```

### 2️⃣ Answer the Interactive Prompts

The script will ask:

```
📌 Project Name (e.g., "Beauty Q4 2024"): My Beauty Batch 1
🎯 Niche/Category (e.g., "Fashion", "Beauty", "Tech", "Fitness"): Beauty
🌍 Region/Country (e.g., "India", "USA", "Global"): India
📊 Min Followers (e.g., 1000): 2000
📊 Max Followers (e.g., 10000): 50000
🏢 Brand/Account Min Followers (e.g., 3000): 5000
📦 Batch Number (e.g., 1): 1

📍 Enter hashtags (20 recommended, one per line). Type "DONE" when finished:
   Hashtag 1: beautybloggerindia
   Hashtag 2: skincarereview
   ...
   Hashtag 20: DONE

✅ Enter positive keywords for influencer profiles...
❌ Enter noise keywords to EXCLUDE profiles...
🏪 Enter brand/shop detection keywords...

💾 Excel file path (leave blank for current dir): 
```

### 3️⃣ Sit Back

Browser opens, logs into Instagram (first run only), then runs fully headless. Results appended to Excel.

---

## 📊 Configuration Examples

### Example 1: Beauty Influencers (Micro-tier)

```
Project Name: Beauty Collab Q4
Niche: Beauty
Region: India
Min Followers: 10000
Max Followers: 100000
Brand Min: 5000
Batch: 1

Hashtags: beautybloggerindia, skincare_junkie, makeupblogger, 
          beautyreviewsindia, skincareblogger, beautyvlogger,
          makeuptutorial, glowupwithme, beautyinfluencer, beautytrend

Positive Keywords: beauty, blogger, creator, makeup, skincare, 
                  vlog, content, influencer, makeup artist, 
                  skincare enthusiast

Noise Keywords: music, gaming, crypto, forex, clinic, hospital,
               pharmacy, medicines

Brand Keywords: shop now, free shipping, order now, dm to order,
               link in bio, skincare line, beauty brand
```

### Example 2: Tech Gadget Reviewers (Global)

```
Project Name: Tech Gadget Reviewers Batch 1
Niche: Tech
Region: Global
Min Followers: 5000
Max Followers: 50000
Brand Min: 3000
Batch: 1

Hashtags: techreview, gadgetreview, unboxing, techyoutube,
         techtok, gadgetunboxing, smartphone, smartwatch,
         techtuber, gadgetlovers, techiereviewers, gadgetgadget

Positive Keywords: tech, gadget, review, unboxing, creator, 
                  vlogger, YouTuber, tech enthusiast, 
                  gadget reviewer, channel

Noise Keywords: phone scam, fake tech, crypto, forex, trading,
               hotel, restaurant, music producer

Brand Keywords: shop our, free shipping, order now, visit store,
               link in bio, official store, buy here, shop tech
```

### Example 3: Fitness Trainers (Micro→Macro)

```
Project Name: Fitness Trainers India
Niche: Fitness
Region: India
Min Followers: 20000
Max Followers: 500000
Brand Min: 10000
Batch: 1

Hashtags: fitnesstrainindia, gymmotivation, workoutinspiration,
         fitnessblogger, fitnessguru, transformationgoals,
         fitnessinfluencer, onlinefitnesstrainer, fitnesscontent,
         bodybuildingleisureindia, fitnessstudio

Positive Keywords: fitness, trainer, workout, gym, coach, 
                  creator, vlog, content, exercise, transformation,
                  personal trainer, nutrition

Noise Keywords: music producer, gaming, casino, betting, drugs,
               illegal, scam

Brand Keywords: online coaching, diet plan, supplement, course,
               certification, coaching program, join now
```

### Example 4: Food Bloggers (Niche)

```
Project Name: Food Bloggers India Batch 1
Niche: Food
Region: India
Min Followers: 1000
Max Followers: 25000
Brand Min: 2000
Batch: 1

Hashtags: foodbloggerindia, foodinstagram, recipereels,
         foodvlogger, indianfoodrecipes, cookingathome,
         homemade, recipevideo, foodphotography, 
         kitchenhacks, easyfood

Positive Keywords: food, blogger, creator, cooking, recipe,
                  vlogger, foodie, content creator, chef,
                  cooking channel

Noise Keywords: restaurant chain, fast food, delivery partner,
               gaming, crypto, forex

Brand Keywords: cookware, kitchen tool, recipe app, meal kit,
               food subscription, order online, shop now
```

---

## 📁 Output Structure

After each run, you get:

**Excel File:** `{ProjectName}_Tracker.xlsx`

### Sheet 1: Influencer Prospects (Individual Creators)

| Handle | Name | Profile URL | Followers | Tier | Niche | Collabs? | Email | Found Via | Location | Status | DM Sent | Response | Notes |
|--------|------|-------------|-----------|------|-------|----------|-------|-----------|----------|--------|---------|----------|-------|
| username1 | Real Name | [link] | 4500 | Nano | Beauty / Style | Unknown | — | hashtag1 | Mumbai | Not Contacted | — | — | Batch 1 — auto-scouted |

### Sheet 2: Brand & Macro Prospects (Companies/Shops)

| Handle | Name | Profile URL | Followers | Tier | Niche | Category | Collabs? | Email | DM Sent? | Notes | Status | Priority | Est. Fee | Hashtags Used |
|--------|------|-------------|-----------|------|-------|----------|----------|-------|---------|-------|--------|----------|----------|---------------|
| beautyshop1 | The Beauty Store | [link] | 15000 | Small Brand | Beauty / Brand | D2C / Brand | Unknown | — | No | Batch 1 — auto-scouted | Pending | MED | ₹5,000–₹15,000 | hashtag1 |

---

## 🔄 How It Works (In Depth)

### STEP 1: DISCOVER
- Scrapes your 20 hashtags via Instagram's internal API
- Extracts: username, follower count, name, bio
- Expected yield: 300–500 raw candidates

### STEP 2: IDENTIFY
- Enriches profiles via Instagram Web API (`/api/v1/users/web_profile_info/`)
- Retries on rate limits (429) with exponential backoff
- Caps at 200 API calls per run (rest use cached data)
- Serial, 2s delay between calls

### STEP 3: SCOUT (Quality Filters in Order)
1. **Dedup** — Skip if handle already in Excel
2. **Noise Filter** — Drop if bio/name contains noise keywords
3. **Brand Detection** — Classify as brand if bio/name contains brand keywords
   - Brands with `followerMin` → "Brand & Macro Prospects" tab
   - Brands under `followerMin` → dropped
4. **Positive Filter** — Keep only if bio/name contains at least one positive keyword
5. **Follower Range** — Must be between `followerMin` and `followerMax`
6. **Sort & Cap** — Top 50 by followers

### STEP 4: WRITE TO EXCEL
- Creates new file if doesn't exist (with headers)
- Appends rows to existing files (reusable for multiple batches)
- Adds hyperlinks to all profile URLs

---

## 🛡️ Smart Filters: How They Work

### Positive Keywords
These are **must-haves** for profiles to be considered influencers. The bio/name/username must contain **at least one**.

**Example for Beauty:**
```
beauty, blogger, creator, makeup, skincare, vlogger, content,
influencer, makeup artist, beauty enthusiast, beautician
```

If someone's bio is *"Dog lover 🐕 | Lives in NYC"* → **excluded** (no positive keyword)  
If someone's bio is *"Beauty tips & makeup tutorials 💄"* → **included** (has "Beauty" + "makeup")

### Noise Keywords
These are **exclusion keywords**. Profiles with ANY noise keyword are dropped.

**Example:**
```
music, gaming, forex, casino, hospital, clinic
```

If someone's bio is *"Makeup Artist | Music Producer"* → **excluded** (has "Music")  
If someone's bio is *"Makeup Artist | Fashion Blogger"* → **included** (no noise keywords)

### Brand Keywords
These identify commercial accounts vs. personal influencers.

**Example for Beauty:**
```
shop now, free shipping, order now, dm to order, link in bio,
cosmetics line, beauty products, buy here
```

If bio is *"💄 Skincare Routine Tips | DM for my eBook"* → **Influencer** (no brand keywords)  
If bio is *"Shop our organic skincare! FREE SHIPPING | Order now"* → **Brand** (has brand keywords)

---

## ⚙️ Configuration Reference

### User-Provided Variables (Changed Each Run)

| Variable | Example | Notes |
|----------|---------|-------|
| `projectName` | "Beauty Q4 Batch 1" | Used for Excel filename |
| `niche` | "Beauty" | Used in Niche/Content Type column |
| `region` | "India" | Used in Location column |
| `followerMin` | 1000 | Influencer floor |
| `followerMax` | 50000 | Influencer ceiling |
| `brandFollowerMin` | 3000 | Brands below this are excluded |
| `batchNumber` | 1 | Incremented per run, in Notes column |
| `hashtags[]` | ["hashtag1", "hashtag2", ...] | 20 recommended, max 25 |
| `positiveKeywords[]` | ["blogger", "creator", ...] | Bio must have ≥1 |
| `noiseKeywords[]` | ["music", "gaming", ...] | Bio with any = drop |
| `brandKeywords[]` | ["shop now", "order now", ...] | Used for brand classification |
| `excelPath` | "./Beauty_Tracker.xlsx" | Full path, auto-created if not exists |

### Fixed Configuration (Tuning Performance)

| Config | Value | Explanation |
|--------|-------|-------------|
| `DISCOVER_DELAY_MS` | 450 | Delay between hashtag scrapes (avoid rate limit) |
| `IDENTIFY_DELAY_MS` | 2000 | 2-second delay between profile API calls |
| `IDENTIFY_CONCURRENCY` | 1 | Fetch profiles serially (safer) |
| `MAX_API_FETCHES` | 200 | Cap on API calls per run |
| `MAX_BATCH_SIZE` | 50 | Top 50 influencers per batch (by followers) |
| `MAX_CONSECUTIVE_429S` | 3 | Stop fetching after 3 rate-limit hits |

---

## 🔐 Security & Sessions

**First run:**
- Browser opens for manual Instagram login
- Session cookies saved to `instagram_session.json`

**Future runs:**
- Session auto-loaded → fully headless
- No manual login needed

**Troubleshooting:**
- Delete `instagram_session.json` to re-authenticate
- Ensure Instagram account has no 2FA active (or use app password)

---

## 📈 Tier Definitions

### Influencer Tiers
| Followers | Tier Label |
|-----------|-----------|
| 1K–10K | Nano (1K-10K) |
| 10K–100K | Micro (10K-100K) |
| 100K+ | Macro (100K+) |

### Brand Tiers & Estimated Fees (INR)
| Followers | Tier | Estimated Fee | Priority |
|-----------|------|---------------|----------|
| <10K | Nano Brand (<10K) | ₹3,000–₹8,000 | LOW |
| 10K–30K | Small Brand (10K-30K) | ₹5,000–₹15,000 | MED |
| 30K–100K | Macro (30K-100K) | ₹15,000–₹40,000 | HIGH |
| 100K+ | Mega (100K+) | ₹40,000–₹1,00,000 | HIGH |

---

## ⚠️ Common Issues

### Issue: "Rate limited (429), backing off"
**Cause:** Instagram throttled API requests  
**Fix:** Script auto-retries with exponential backoff. If continues, try next day.

### Issue: Instagram login fails / Session expired
**Cause:** 2FA enabled or session stale  
**Fix:** Delete `instagram_session.json` and re-run. Disable 2FA temporarily if possible.

### Issue: Few results / No profiles found
**Cause:** Hashtags are too niche, or positive keywords don't match  
**Fix:**
- Use more popular hashtags (test on Instagram first)
- Broaden positive keywords
- Lower `followerMin` / raise `followerMax`

### Issue: Too many brands, not enough influencers
**Cause:** Brand keywords too loose  
**Fix:** Make brand keywords more specific (e.g., "shop now" vs just "shop")

---

## 🎓 Workflow Example: Beauty Influencers

### Batch 1
```bash
node influencer_scout_generalized.js
→ Project: "Beauty India Batch 1"
→ Followers: 2K–25K
→ Result: 38 influencers + 12 brands added to Excel
```

### Batch 2 (Next Week)
```bash
node influencer_scout_generalized.js
→ Same project, Batch 2
→ Different 20 hashtags (don't reuse)
→ Result: +42 new influencers appended to Excel
→ Existing handles auto-skipped (dedup)
```

### After 5 Batches
You have 200+ carefully filtered beauty influencers in one Excel file, ready to outreach. ✨

---

## 🚀 Tips for Best Results

1. **Test hashtags on Instagram first** — Know which ones have active creators
2. **Keep positive keywords tight** — More specific = less noise
3. **Use 20–25 hashtags per batch** — Optimal yield without diminishing returns
4. **Rotate hashtags** — Don't reuse from previous batches (Instagram ranks differently)
5. **Check dedup before reaching out** — Excel will prevent duplicate entries
6. **Set follower range based on your budget** — Nano (cheap) vs Macro (premium)
7. **Monitor the terminal output** — It tells you filtering stats per batch

---

## 📝 Next Steps

1. Copy the script to your project folder
2. Run `node influencer_scout_generalized.js`
3. Answer the 5-minute setup prompts
4. Let it run (first time: manual login, ~5 min. Future runs: fully headless, ~10 min)
5. Check the Excel file for results
6. Repeat with new hashtags for Batch 2, 3, 4, etc.

Happy scouting! 🎯

---

**Questions or issues?** Check terminal output for debug logs (`🔍` prefix).
