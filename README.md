# 🚀 Generalized Influencer Scout — Complete Package

> **📌 PUBLIC README** — This document is for public distribution and GitHub.

You now have a **fully generalized, user-configurable influencer discovery system** that works for **any niche, region, and follower range**.

⚠️ **IMPORTANT:** This software is licensed for **personal use only**. Commercial or professional use requires explicit written permission from the author. See LICENSE file.

---

## 📦 What You've Received

### 1. **Main Script**
📄 `influencer_scout_generalized.js`

The core Node.js application that:
- Runs interactive setup prompts (no code editing needed)
- Scrapes Instagram hashtags (Discover phase)
- Enriches profiles via Instagram API (Identify phase)
- Applies smart filters (Scout phase)
- Writes results to Excel with hyperlinks (Write phase)
- Handles rate-limiting, session persistence, deduplication

**Flexible for ANY niche, region, and follower range.**

---

### 2. **Documentation**

#### 📘 `GENERALIZED_SETUP_GUIDE.md`
Complete, in-depth guide covering:
- Prerequisites & installation
- Step-by-step walkthrough
- Configuration reference (all variables explained)
- How the pipeline works (Discover → Identify → Scout → Write)
- Tier definitions & fees
- Common issues & troubleshooting
- Workflow examples

**Read this if you want to understand how everything works.**

#### 📋 `QUICK_REFERENCE.md`
One-page cheat sheet with:
- All questions you'll be asked (in order)
- Filter logic (visual diagram)
- Keyword tips (positive, noise, brand)
- Timing & workflow
- Copy-paste examples for 3 niches
- Troubleshooting

**Keep this open while running the script.**

#### 🎓 `NICHE_TEMPLATES.md`
Pre-configured templates for 12 common niches:
- Fashion (India, Nano)
- Beauty (Global, Micro)
- Gaming (Global, Micro→Macro)
- Fitness (India, Micro)
- Food (India, Nano→Micro)
- Luxury Fashion (Global, Macro)
- Makeup Artistry (Global, Micro)
- Sustainable Fashion (Global, Nano→Micro)
- Tech Lifestyle (Global, Micro)
- Yoga & Wellness (Global, Nano→Micro)
- Photography (Global, Nano→Micro)
- Design & Art (Global, Nano)
- Restaurant Marketing (Local)

**Just copy-paste a template and run. No thinking required.**

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install playwright exceljs
npx playwright install chromium
```

### Step 2: Run the Script
```bash
node influencer_scout_generalized.js
```

### Step 3: Answer 12 Questions
- Project name, niche, region, follower range
- 20 hashtags (or use a template)
- Positive keywords (must-haves)
- Noise keywords (exclusions)
- Brand detection keywords
- Excel file path

### Step 4: Let It Run
- **First run:** Browser opens for Instagram login (save session)
- **Future runs:** Fully headless, ~10 minutes

### Step 5: Check Results
- Open the Excel file
- Two tabs: "Influencer Prospects" + "Brand & Macro Prospects"
- Ready to outreach!

---

## 🗂️ File Structure

```
.
├── influencer_scout_generalized.js    [Main script]
├── README.md                          [This file]
├── GENERALIZED_SETUP_GUIDE.md         [Complete guide]
├── QUICK_REFERENCE.md                 [One-page cheat sheet]
├── NICHE_TEMPLATES.md                 [12 pre-built templates]
├── instagram_session.json             [Auto-created on first run]
└── {ProjectName}_Tracker.xlsx         [Output file (auto-created)]
```

---

## 🔄 Pipeline Overview

### STEP 1: DISCOVER (Scrape Hashtags)
- Takes 20 hashtags you provide
- Scrapes Instagram's hashtag API
- Extracts: username, follower count, name, bio
- Yield: 300–500 raw candidates

### STEP 2: IDENTIFY (Fetch Full Profiles)
- For profiles without cached data, fetches via Instagram API
- Handles rate limits gracefully (auto-retry with backoff)
- 2-second delay between calls (respectful)
- Caps at 200 API calls per run

### STEP 3: SCOUT (Quality Filters)
Applied in this order:
1. **Dedup** → Skip if already in Excel
2. **Noise** → Drop if bio has music/gaming/crypto/etc
3. **Brand?** → Classify as brand if has brand keywords
   - Brands 3K+ → Brand tab
   - Brands <3K → drop
4. **Positive** → Must have ≥1 positive keyword (blogger/creator/etc)
5. **Followers** → Must be between your min–max
6. **Sort & Cap** → Top 50 by followers

### STEP 4: WRITE TO EXCEL
Creates/updates Excel file with:
- **Influencer Prospects tab:** Personal creators (1K–10K or your range)
- **Brand & Macro Prospects tab:** Companies/accounts 3K+ followers
- All URLs are clickable hyperlinks
- Pre-filled tier, niche, notes
- Ready for outreach

---

## 📊 What You'll Get (Output)

### Excel File: `{YourProjectName}_Tracker.xlsx`

#### Sheet 1: Influencer Prospects
```
Handle | Name | Profile URL | Followers | Tier | Niche | 
Collabs? | Email | Found Via | Location | Status | DM Sent | 
Response | Notes
```

Example row:
```
username1 | Priya | [link] | 4500 | Nano | Beauty / Style |
Unknown | — | hashtag1, hashtag2 | Mumbai | Not Contacted | — | — | Batch 1 — auto-scouted
```

#### Sheet 2: Brand & Macro Prospects
```
Handle | Name | Profile URL | Followers | Tier | Niche | 
Category | Collabs? | Email | DM Sent? | Notes | Status | 
Priority | Est. Fee | Hashtags Used
```

Example row:
```
beautyshop1 | The Beauty Store | [link] | 15000 | Small Brand |
Beauty / Brand | D2C / Brand | Unknown | — | No | Batch 1 — auto-scouted |
Pending | MED | ₹5,000–₹15,000 | hashtag1, hashtag2
```

---

## 💡 Key Features

✅ **Interactive Setup** — No code editing. Just prompts.

✅ **Any Niche** — Fashion, Beauty, Tech, Fitness, Food, etc.

✅ **Any Follower Range** — 1K nano-influencers or 100K+ macros

✅ **Smart Filters** — Positive keywords, noise filters, brand detection

✅ **Deduplication** — Automatically skips handles already in Excel

✅ **Rate Limit Handling** — Auto-retries with exponential backoff

✅ **Session Persistence** — Login once, run headless forever

✅ **Excel Integration** — Direct append to existing files

✅ **Hyperlinks** — All profile URLs are clickable

✅ **Pre-filled Fields** — Tier, niche, notes auto-populated

✅ **Batch Tracking** — Track which batch added each row

---

## 🎯 Common Use Cases

### Batch Influencer Discovery
```
Week 1: Beauty Batch 1 (hashtags A–T)   → +38 influencers
Week 2: Beauty Batch 2 (hashtags U–J)   → +42 influencers (no duplicates)
Week 3: Beauty Batch 3 (hashtags K–Z)   → +35 influencers
Total: 115 beauty influencers in one Excel file after 3 weeks
```

### Niche-Specific Scouting
```
Project: "Tech Gadget Reviewers"
Niche: Tech
Follower Range: 10K–200K
Region: Global
→ 50+ tech creators ready to pitch
```

### Regional Focus
```
Project: "Mumbai Fashion"
Niche: Fashion
Follower Range: 5K–50K
Region: Mumbai
→ 40+ local fashion influencers
```

### Brand Partner Search
```
Project: "Beauty Brand Partnerships Q4"
→ 2 sheets:
   - Micro-influencers (5K–100K) for ambassador programs
   - Brands/sellers (3K–50K) for affiliate partnerships
```

---

## 🔧 Customization

### Adjust Follower Range
```
Want Mega-influencers only?
  Min: 100000
  Max: 500000
```

### Change Filters
```
Your niche has different keywords?
  Edit Positive Keywords to match your industry
  Add/remove Noise Keywords as needed
  Customize Brand Keywords for your category
```

### Use Different Hashtags
```
Each batch should use new hashtags
  Batch 1: hashtags A–T
  Batch 2: hashtags U–J
  Batch 3: hashtags K–Z
```

### Target Different Regions
```
Change region, use region-specific hashtags
  India → #indianfashion, #mumbaifashion
  Global → #fashionblogger, #ootd
  Brazil → #fashionbrasil, #estilo
```

---

## ⚡ Performance Reference

| Metric | Time | Details |
|--------|------|---------|
| Setup (prompts) | 5 min | One-time per batch |
| First run | 15 min | Manual Instagram login |
| Future runs | 8–12 min | Fully headless |
| Yield per batch | 30–50 | Influencers (top 50) |

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Rate limited (429) | Script auto-retries. If continues, wait 1 hour. |
| Login fails | Delete `instagram_session.json` and re-run. |
| Few results | Use more popular hashtags, broaden keywords. |
| Too many noise | Make noise keywords more specific. |

**See GENERALIZED_SETUP_GUIDE.md for more troubleshooting.**

---

## 📚 Document Guide

| Document | When to Read | What You'll Learn |
|----------|--------------|------------------|
| This README | First (you are here) | Overview & quick start |
| GENERALIZED_SETUP_GUIDE.md | Before first run | How everything works |
| QUICK_REFERENCE.md | During setup | Remember what to type |
| NICHE_TEMPLATES.md | When ready to run | Copy-paste values |

---

## 🎓 Workflow Example: Beauty Influencers

### Before Running
1. **Copy template:** `NICHE_TEMPLATES.md` → Beauty section
2. **Review guide:** `GENERALIZED_SETUP_GUIDE.md` → Configuration section

### Running Batch 1
```bash
$ node influencer_scout_generalized.js

📌 Project Name: Beauty India Batch 1
🎯 Niche: Beauty
🌍 Region: India
📊 Min Followers: 2000
📊 Max Followers: 50000
📍 Hashtags: [paste 20 hashtags from template]
✅ Positive: [paste keywords from template]
❌ Noise: [paste keywords from template]
🏪 Brand: [paste keywords from template]

[Script runs for ~10 min]
✅ Complete: Added 38 influencers to Beauty_India_Batch_1_Tracker.xlsx
```

### Batch 2 (Next Week)
- Change `Batch Number` to 2
- Use **different 20 hashtags** (don't reuse)
- Run again
- **Dedup prevents duplicate entries**
- Now have 38 + 42 = 80 influencers total

### After 4 Batches
You have **160+ carefully vetted beauty influencers** in one Excel file, ready to outreach.

---

## ✅ Checklist Before First Run

- [ ] Node.js v16+ installed
- [ ] `npm install playwright exceljs`
- [ ] `npx playwright install chromium`
- [ ] Instagram account ready
- [ ] Niche decided
- [ ] Template picked (or custom keywords thought through)
- [ ] Follower range chosen
- [ ] Time allocated (first run: 15 min)

---

---

## 🚀 Next Steps

1. **Install:** `npm install playwright exceljs && npx playwright install chromium`
2. **Read:** `QUICK_REFERENCE.md` (5 min)
3. **Choose:** Pick a template from `NICHE_TEMPLATES.md` or design your own
4. **Run:** `node influencer_scout_generalized.js`
5. **Paste:** Copy-paste template values into prompts
6. **Wait:** Let it run (10–15 min first time)
7. **Harvest:** Open Excel, get scouting! 🎯

---

## 📞 Support

**Question:** Check the relevant doc:
- **How to use?** → `GENERALIZED_SETUP_GUIDE.md`
- **What to type?** → `QUICK_REFERENCE.md`
- **Ready to run?** → `NICHE_TEMPLATES.md`
- **Something broke?** → `GENERALIZED_SETUP_GUIDE.md` → Troubleshooting section

---

## 📝 Version Info

- **Version:** 1.0
- **Compatible:** Node.js v16+, Windows/Mac/Linux
- **Instagram:** Works with Instagram Web (no official API required)

---

**You're all set! Pick a niche, answer 12 questions, and discover influencers. Happy scouting! 🎯✨**

---

## 📜 License & Usage Terms

**⚠️ IMPORTANT:** This software is for **PERSONAL & EDUCATIONAL USE ONLY**

## 📜 License: Personal Use Only

**Generalized Influencer Scout** is licensed for **personal, non-commercial use ONLY**.

### ✅ WHAT YOU CAN DO (Personal Use)

- ✅ Use for personal projects
- ✅ Learn and study the code
- ✅ Modify for your own needs (on your machine only)
- ✅ Experiment and educate yourself
- ✅ Use indefinitely at no cost
- ✅ Private, non-profit use

### ❌ WHAT YOU CANNOT DO (Commercial Prohibited)

**Commercial use is STRICTLY PROHIBITED without explicit written permission.**

You CANNOT use this software for:
- ❌ Any business or professional capacity
- ❌ Freelance or consulting services
- ❌ Selling services based on this software
- ❌ Agency or corporate deployment
- ❌ Client deliverables
- ❌ SaaS platforms or features
- ❌ Any revenue-generating activity
- ❌ Team or organizational use
- ❌ Sharing with colleagues/clients
- ❌ Distribution or publication (GitHub, etc.)

### 💼 IF YOU NEED COMMERCIAL USE

**Contact the author for explicit written permission:**

```
Email: adhayatm@gmail.com
Subject: "Generalized Influencer Scout - Commercial License Inquiry"

Include in your message:
- Your name and organization
- Describe your intended use case
- Explain your business model/revenue model
- Estimated project scale
- Timeline for implementation
- Budget expectations (if any)
```

**Commercial License Terms:**
- Custom license agreement required
- Pricing determined case-by-case
- Based on scope, scale, and revenue model
- Support and updates included
- Terms negotiated individually

### 🚨 LEGAL NOTICE

**Unauthorized commercial use is a violation of this license and may result in:**
- Cease-and-desist letters (C&D)
- DMCA takedown notices
- Legal proceedings and litigation
- Financial damages and penalties
- Injunctive relief to stop use
- Attorney fees and court costs

**This is a legally binding agreement. By using this software, you agree to these terms.**

---

See `LICENSE` file for complete legal terms and detailed restrictions.

---

### 📖 Quick Links
- **Setup Guide** → Read `GENERALIZED_SETUP_GUIDE.md`
- **Quick Ref** → Open `QUICK_REFERENCE.md`
- **Templates** → Check `NICHE_TEMPLATES.md`
- **Run Script** → `node influencer_scout_generalized.js`
- **License** → See `LICENSE` file for full terms
