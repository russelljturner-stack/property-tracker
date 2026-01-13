# Session 9 Handover Document

**Date:** 2026-01-12
**Focus:** Development Tabs Detailed Review with Russell's Input

---

## Session Summary

This session completed a comprehensive tab-by-tab review of the FileMaker Development layout with Russell providing detailed input on each tab. All 10 tabs (28 sub-tabs, ~200+ fields) have now been reviewed with business context, design implications, and decisions captured.

---

## Key Documents Updated

### 1. `docs/phase1/08-development-tabs-review.md`
- **Status:** ✅ COMPLETE
- All 10 tabs reviewed with Russell's input captured
- Design implications documented for each tab
- Summary table of key decisions added

### 2. `docs/decisions/architecture-decisions.md`
- **Added ADR-013:** Product Strategy: Built to Sell
- **Added ADR-014:** Consultancy Module Deferred

---

## Major Decisions Made This Session

### ADR-013: Product Strategy - Built to Sell
Russell revealed the strategic vision: this system will be sold to other outdoor advertising developers, not just used internally. This changes everything:

- **App personality:** Action-oriented, celebratory, energetic - not just a database
- **White-labeling:** Branding/colours configurable per customer
- **Multi-tenant ready:** Architecture should support multiple companies
- **Modular features:** Can be enabled/disabled per customer
- **No hardcoded company names:** Use generic terms

### ADR-014: Consultancy Module Deferred
The Consultancy tab (6 sub-tabs) is company-specific and won't be in other developers' workflows:
- Rent Review, Lease Renewal, Valuation, Revenue Share, Rent Collection, Other - all deferred
- Can be added as optional module later if customer demand emerges
- Saves significant development time for core product

---

## Tab-by-Tab Review Summary

### Tab 1: Development (Main Tab)
**Key Insights:**
- Site context (map + photos) is CRITICAL - determines asset value
- Proposed development visual equally critical - the exciting thing being sold
- Status and "what's next" matter most - momentum focus
- App personality: action-oriented, celebratory, energetic

**Design Implications:**
- Two hero visuals always accessible: site context + proposed asset
- UI should emphasise momentum, not just data
- Make it obvious what's blocking progress

### Tab 2: Survey
**Key Insights:**
- ASGF = roadside advertising suitability report
- Survey data lives on Site (entered once, not updated)
- Development history at site is critical intelligence

**Decision:** Site Context Panel on Development Page (Option C)
- Persistent/expandable panel showing: site photo, map, "X other developments at this site"
- Full Site page still exists for deeper info

### Tab 3: Commercial Agreement
**Key Insights:**
- Legal role needs to be added to system
- Financial/contract data restricted to: assigned developer, team leaders, leadership, legal
- Existing Lease = competitive intelligence (lease expiry alerts needed)
- Contract deadlines should route alerts to relevant teams

**Design Implications:**
- Role-based visibility for Commercial tab
- Lease expiry alert system
- Contract deadline alerts routed by type (planning deadline → planning team)

### Tab 4: Design
**Key Insights:**
- Design status: Proposed → Draft → Final (not just Draft/Final)
- Multiple document types per design (hero image, technical drawings, supporting docs)
- Dual sign-off: internal AND client
- Design importance varies by customer (some design-led, others not)

**Design Implications:**
- Design section should be configurable per customer (productisation)
- Track both internal and client sign-off
- "Hero" visual progression: Stock → Proposed → Draft → Final

### Tab 5: Planning
**Key Insights:**
- Planning is THE critical bottleneck - hardest part of the process
- Planning Score (1-5) is critical and should be prominent
- Appeals are common for advertising submissions
- **Planning Score = Financial Weighting Factor**
  - Weighted Value = Projected Revenue × (Planning Score / 5)
- Planning approval = value creation moment (speculative → real value)

**Design Implications:**
- Planning Score visible on development cards, colour-coded
- Pipeline reports show gross AND weighted value
- Planning approval should be celebrated (reinforces app personality)
- Distinguish pre-planning vs post-planning value in reports

### Tab 6: Marketing
**Key Insights:**
- 5-6 offers typical per tender
- Videos are actively used - real requirement
- Marketing assets often become the primary development imagery (best CGIs)

**Design Implications:**
- Offer comparison view needed (5-6 offers side-by-side)
- Rich media gallery with video support
- "Set as primary" feature - any image can become development's hero
- Asset Promotion Feature: images not siloed by section

### Tab 7: Build
**Key Insights:**
- 4-5 main build parts typical
- Not always tendered - sometimes direct appointment

**Design Implications:**
- Support both tendering and direct appointment paths
- Toggle: "Tender required?" shows/hides tender fields
- Snagging is a simple checklist workflow

### Tab 8: Consultancy - DEFERRED
**Decision:** Not included in core product (ADR-014)
- Company-specific business model
- Would confuse other customers
- Can be added as optional module later

### Tab 9: Tasks & Notes
**Key Insights:**
- Tasks should definitely have priority levels (High/Medium/Low)
- Notes are informal communication, not audit trail

**Design Implications:**
- Add priority field to tasks with colour-coding
- Notes = simple comment thread with attachments

### Tab 10: Contacts
**Key Insights:**
- Site Roles: Asset Manager, Marketing, Planning, Administrator
- Decision Levels: Decision Maker, Influencer
- Agents can also influence decisions - not just administrative

**Design Implications:**
- Site Role and Decision Level fields on contacts
- Both Owner contacts and Agent contacts can have decision authority
- "Contact left" tracking preserves history

---

## Next Session: Development Page Revisions

The next session should focus on **incrementally updating the Development detail page** based on today's review.

### Current Page State
- Located at: `src/app/(authenticated)/developments/[id]/page.tsx`
- Has: Progress timeline, stage cards, tasks, sidebar with contacts/activity
- Missing: The key improvements identified today

### Planned Updates (in priority order)

1. **Site Context Panel**
   - Add map + site photo + development history
   - Persistent or expandable section
   - Links back to full Site page

2. **Proposed Asset Visual**
   - Hero image showing the development
   - Pull from Design section or show stock placeholder
   - Progression: Stock → Proposed → Draft → Final

3. **Planning Score Display**
   - Prominently displayed, colour-coded (1-5)
   - Show probability indicator
   - Consider weighted value display

4. **"What's Next" Action Prompt**
   - Make it obvious what needs to happen to progress
   - Ties to status and next required action

5. **Task Priority**
   - Add High/Medium/Low display
   - Colour coding: Red/Amber/Grey

6. **Marketing Stage Card**
   - Currently missing from stage cards
   - Need tender status, offers summary

7. **Enhanced Contacts**
   - Add Site Role and Decision Level display
   - Visual indicator for Decision Makers

8. **Design Stage Card Updates**
   - Proposed → Draft → Final status
   - Dual sign-off tracking (internal + client)

### Todo List for Next Session
```
[ ] Add Site Context Panel (map + photo + development history)
[ ] Add Proposed Asset hero visual section
[ ] Add Planning Score prominently displayed
[ ] Add priority field to Task display
[ ] Update Design stage card (Proposed/Draft/Final, dual sign-off)
[ ] Add Marketing stage card with tender workflow
[ ] Enhance contacts display with Site Role and Decision Level
[ ] Add 'What's Next' action prompt in header
```

---

## Files Changed This Session

| File | Change |
|------|--------|
| `docs/phase1/08-development-tabs-review.md` | Extensive updates - all 10 tabs reviewed with Russell's input |
| `docs/decisions/architecture-decisions.md` | Added ADR-013 (Product Strategy) and ADR-014 (Consultancy Deferred) |

---

## Key Terminology Clarified

| Term | Meaning |
|------|---------|
| ASGF | Roadside advertising suitability report |
| Planning Score | 1-5 rating of planning approval probability |
| Tender | Process of selling advertising opportunity to media owners |
| Consultancy | Advisory deal where you don't operate the site, just advise landowner |
| Decision Maker | Contact with authority to approve/sign off |
| Influencer | Contact who can sway decisions but no final authority |
| Site Role | Contact's area of responsibility (Asset Manager, Marketing, Planning, Administrator) |

---

## Important Context for Next Session

1. **The app needs personality** - It should feel energetic and celebratory, not like a dry database. This affects language, colours, and micro-interactions.

2. **Planning is the bottleneck** - The Planning Score should be one of the most prominent elements because getting planning approval is the hardest and most important milestone.

3. **Marketing assets become hero imagery** - The best visuals often come from marketing materials (CGIs), not design drafts. The system should allow any image to become the development's "face."

4. **Product mindset** - Every decision should consider: would this work for other outdoor advertising developers, or is it too company-specific?

5. **Incremental approach agreed** - Russell wants to update the Development page incrementally, starting with the most impactful changes.

---

## Test Credentials (unchanged)
- **URL:** https://property-tracker-production-ac30.up.railway.app
- **Email:** test@example.com
- **Password:** password123

---

## Questions Resolved This Session

All questions from the tab review document have been answered. No outstanding questions.

---

*End of Session 9 Handover*
