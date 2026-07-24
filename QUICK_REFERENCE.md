# Influencer Scout — Quick Reference

## 🚀 One-Line Start
```bash
node influencer_scout_generalized.js
```

---

## 📋 Questions You'll Be Asked (In Order)

| # | Question | Example | Notes |
|---|----------|---------|-------|
| 1 | Project Name | "Beauty India Q4" | Used for Excel file name |
| 2 | Niche/Category | "Beauty", "Tech", "Fitness" | What you're scouting for |
| 3 | Region/Country | "India", "Global", "USA" | Used in Location column |
| 4 | Min Followers | 1000 | Floor for influencers |
| 5 | Max Followers | 50000 | Ceiling for influencers |
| 6 | Brand Min Followers | 3000 | Brands below this = excluded |
| 7 | Batch Number | 1 | Increment each run |
| 8 | Hashtags (20) | beautybloggerindia, etc. | Type "DONE" when done |
| 9 | Positive Keywords | blogger, creator, content | Bio must have ≥1 |
| 10 | Noise Keywords | music, gaming, crypto | Bio with any = drop |
| 11 | Brand Keywords | "shop now", "free shipping" | For brand detection |
| 12 | Excel Path | (leave blank for current) | Auto-creates if new |

---

## 🎯 Filter Logic (Simplified)

```
Raw Candidates from Hashtags (300–500)
        ↓
   [DEDUP] → Already in Excel? Drop.
        ↓
  [NOISE] → Bio has music/gaming/crypto? Drop.
        ↓
  [BRAND?] → Has "shop now" / "order now"?
        ├→ YES: Followers ≥ 3000? → Brand tab | < 3000? Drop
        └→ NO: Continue
        ↓
 [POSITIVE] → Bio has blogger/creator/content? No? Drop.
        ↓
[FOLLOWERS] → Between min–max? No? Drop.
        ↓
  [SORT] → Top 50 by followers → Excel
```

---

## 💡 Keyword Tips

### Positive Keywords (Must-Haves)
✅ **Good for Beauty:** blogger, makeup, skincare, vlogger, creator, content, influencer  
✅ **Good for Tech:** tech, gadget, review, creator, YouTuber, channel, unboxing  
✅ **Good for Fitness:** fitness, trainer, gym, coach, creator, workout, transformation  

### Noise Keywords (Exclusions)
❌ **Generic:** music, gaming, crypto, forex  
❌ **Not fashion/beauty:** hospital, clinic, church, academy  
❌ **Commercial (non-brand):** reseller, dropship, affiliate  

### Brand Keywords
🏪 **e-commerce signals:** "shop now", "order now", "free shipping", "link in bio"  
🏪 **Product signals:** "collection", "line", "designs by", "crafted by", "boutique"  
🏪 **B2B signals:** "wholesale", "bulk order", "corporate gifting"  

---

## 📊 What You Get

### Excel Sheet 1: Influencer Prospects
```
Handle | Name | URL | Followers | Tier | Niche | Collabs? | Email | Status | Notes
———————————————————————————————————————————————————————————————————————————
username1 | Real Name | [link] | 4500 | Nano | Beauty | Unknown | — | Not Contacted | Batch 1
```

### Excel Sheet 2: Brand & Macro Prospects
```
Handle | Name | URL | Followers | Tier | Category | Fee | Priority | Status
————————————————————————————————————————————————————————————————————————————
beautyshop | The Brand | [link] | 12000 | Small | D2C | ₹5–15K | MED | Pending
```

---

## ⏱️ Timing

| Step | Time | Details |
|------|------|---------|
| Setup (prompts) | 5 min | One-time per batch |
| First Run | 15 min | Manual Instagram login |
| Future Runs | 10 min | Fully headless (session cached) |

---

## 🔄 Batch Workflow

```
Week 1: Batch 1 (hashtags A–T)  → 38 influencers added
Week 2: Batch 2 (hashtags U–J)  → +42 new influencers (dedup prevents duplicates)
Week 3: Batch 3 (hashtags K–Z)  → +35 new influencers
Week 4: Batch 4 (hashtags AA–AJ) → +40 new influencers
Total after 4 weeks: 155 influencers in one file ✨
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Rate limited (429) | Script auto-retries. If continues, wait 1 hour & retry. |
| Login fails | Delete `instagram_session.json` and re-run. Disable 2FA if possible. |
| Few results | Use more popular hashtags, broaden keywords, lower min followers. |
| Too many noise | Make noise keywords more specific. |
| No brands found | Add more brand keywords, lower `brandFollowerMin`. |

---

## 📈 Tier Quick-Ref

| Followers | Influencer Tier | Brand Tier | Est. Fee |
|-----------|-----------------|-----------|----------|
| 1K–10K | Nano | Nano Brand | ₹3–8K |
| 10K–30K | Micro | Small Brand | ₹5–15K |
| 30K–100K | Micro/Macro | Macro | ₹15–40K |
| 100K+ | Macro | Mega | ₹40–100K |

---

## 🎓 Copy-Paste Examples

### Beauty Influencers (India, 2K–25K followers)
```
Hashtags: beautybloggerindia, skincare_junkie, makeupblogger,
          beautyvlogger, beautyreviewsindia, skincareblogger

Positive: beauty, blogger, creator, makeup, skincare, vlogger,
         content, influencer, makeup artist

Noise: music, gaming, crypto, forex, clinic, hospital

Brand: shop now, order now, free shipping, link in bio,
       dm to order, cosmetics line
```

### Tech Gadget Reviewers (Global, 5K–50K)
```
Hashtags: techreview, gadgetreview, unboxing, techyoutube,
          techtok, gadgetunboxing, smartphone, techtuber

Positive: tech, gadget, review, creator, unboxing, YouTuber,
         vlogger, channel, tech enthusiast

Noise: music, gaming, forex, crypto, hotel, restaurant

Brand: shop our, order now, free shipping, buy here,
       official store, link in bio
```

### Fitness Trainers (India, 10K–200K)
```
Hashtags: fitnesstrainindia, gymmotivation, fitnessblogger,
          fitnessguru, transformationgoals, fitnessinfluencer,
          onlinefitnesstrainer

Positive: fitness, trainer, workout, gym, coach, creator,
         content, transformation, personal trainer

Noise: music, gaming, crypto, betting, casino

Brand: online coaching, diet plan, course, supplement,
       certification, coaching program
```

---

## 🔐 Session Management

**First run:**
```
Browser opens → You log into Instagram manually
→ Session saved to instagram_session.json
→ Future runs: auto-loaded (headless)
```

**To reset session:**
```bash
rm instagram_session.json
node influencer_scout_generalized.js  # Will ask for login again
```

---

## 📊 Output Files

**Main file:** `{ProjectName}_Tracker.xlsx`

**Session (auto):** `instagram_session.json` (don't edit, don't share)

---

## ✅ Checklist Before Running

- [ ] Node.js v16+ installed (`node --version`)
- [ ] Dependencies installed (`npm install playwright exceljs`)
- [ ] Chromium installed (`npx playwright install chromium`)
- [ ] Instagram account ready (2FA disabled if possible)
- [ ] Hashtags tested on Instagram (active, relevant)
- [ ] Keywords thought through (positive, noise, brand)
- [ ] Follower range makes sense for your budget
- [ ] Excel path writable

---

## 🎯 Best Practices

1. **Use 20–25 hashtags per batch** — Sweet spot for yield
2. **Don't reuse hashtags** — Use new ones each batch
3. **Test keywords with 1–2 batches** — Refine as needed
4. **Check "Found Via" column** — Which hashtags produce best results
5. **Keep Excel file backed up** — It's your growing contact list
6. **Note promising accounts** — Mark in Notes column for later follow-up

---

**Questions? Check the full guide:** `GENERALIZED_SETUP_GUIDE.md`
