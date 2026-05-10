# Internconnected Outreach Operating Plan

## Campaign Thesis

Start with a narrow, dense wedge: summer 2026 NYC interns, with finance and consulting as the first high-signal segment. The outreach goal is not to explain a full app. The goal is to get verified interns to add themselves to the map, then use company pod and school crew unlocks to create referrals.

Core promise:

> Find your intern city, not just your internship.

Primary CTA:

> Add yourself to the 2026 NYC intern map so your company and school can show up in the first Pulse.

## Outreach Goals

| Week | Target | Main motion |
| --- | ---: | --- |
| 1 | 100 verified interns | Seed captains, club contacts, and founder-led DMs |
| 2 | 300 verified interns | Launch the NYC Intern Census publicly |
| 3 | 600 verified interns | Push pod and school crew unlocks |
| 4 | 900 verified interns | Publish the first real NYC Intern Pulse |
| 5 | 1,200 verified interns | Turn Pulse proof into social proof |
| 6 | 1,500 verified interns | Decide what product surface to build first |

## Audience Priority

1. Incoming/current NYC interns
   - Why first: they have the clearest immediate reason to join.
   - Message: "Your company/school pod can unlock before everyone arrives."
   - Best channels: group chats, LinkedIn DMs, Instagram DMs, club channels.

2. Campus club officers and student leaders
   - Why second: they can move dense school clusters quickly.
   - Message: "Help your school show up in the first NYC Intern Pulse."
   - Best channels: LinkedIn, email, Instagram pages, club newsletters.

3. Former interns/new grads
   - Why third: they create the next layer of useful supply, but the census has to feel alive first.
   - Message: "Help the next cohort break in and land in the city with context."
   - Best channels: LinkedIn, alumni communities, finance/consulting clubs.

4. Seekers targeting NYC finance/consulting
   - Why fourth: they are important for the long-term loop, but early public positioning should avoid feeling like a job-search database.
   - Message: "See which firms, schools, and crews are forming. Get closer to the people who already broke in."
   - Best channels: campus clubs, Reddit/resource posts, Wall Street Oasis, LinkedIn comments.

## Channel Plan

### Founder-Led DMs

Use this to recruit the first 20-30 captains and the first 100 verified users.

Daily target:
- 40 LinkedIn DMs
- 20 Instagram DMs
- 10 follow-ups
- 5 captain invites

Priority search terms:
- "incoming summer analyst NYC"
- "incoming investment banking summer analyst"
- "incoming consulting intern NYC"
- "summer 2026 intern NYC"
- "[school] finance club"
- "[school] consulting club"

DM angle:

```text
Hey [Name] - quick one. I am building Internconnected, a verified NYC intern map for summer 2026. The first version is simple: interns add school, company, and role so company pods and school crews can unlock before everyone arrives.

Are you interning in NYC this summer? I can send the early link.
```

### Founding Intern Captains

Captains are the main growth lever. Do not recruit them as generic ambassadors. Recruit them as people helping their company, school, or group chat show up in the first Pulse.

Captain ask:
- Drive 25 verified signups.
- Drop the link in 2 group chats.
- Make 1 LinkedIn, Instagram, or TikTok post.
- Introduce 1 more potential captain.

Captain reward:
- Founding Intern Captain status.
- Early access to unlocked pods.
- Feature in the NYC Intern Pulse.
- Priority invite to first-week plans.

Tracking:
- Every captain gets a referral slug.
- Status lives in `Founding Intern Captain Tracker`.
- Review active captains daily.

### Campus Clubs

Campus clubs are the highest-leverage school crew channel. Prioritize finance, consulting, business, professional fraternities, entrepreneurship, and affinity groups at schools with strong NYC internship density.

First school targets:
- NYU
- Columbia
- Fordham
- Cornell
- Penn
- Princeton
- Rutgers
- Michigan
- Georgetown
- Boston College
- Northeastern
- Harvard
- Yale
- Duke
- UVA

Club ask:

```text
Could you share a 2-line blurb with members interning in NYC this summer? We are mapping the 2026 NYC intern cohort by school, company, and role so school crews can show up in the first Pulse.
```

### Group Chats

Group chats are the conversion channel. The job is to make it very easy for captains and early users to paste one clean message.

Default group chat drop:

```text
If you are interning in NYC this summer, add yourself to Internconnected. It is a 2026 NYC intern map by school, company, and role. If 5 people from the same company or school join, the pod/crew unlocks:
[LINK]
```

Use these link types:
- Captain: `?source=ambassador&ref={{captain_slug}}`
- Club: `?source=campus_club&ref={{club_slug}}`
- Group chat: `?source=group_chat&ref={{chat_slug}}`
- Personal referral: `?source=referral&ref={{referrer_slug}}`

### Public Content

Post daily once the landing page is ready. Content should make the map feel like something forming in public, not a generic startup waitlist.

Daily mix:
- 1 short-form video or visual post.
- 1 LinkedIn founder update or intern-facing caption.
- 1 group chat/captain prompt.
- 1 comment/reply under relevant intern, finance, consulting, or school posts.

Best hooks:
- "Everyone talks about getting the internship. Nobody talks about arriving in the city alone."
- "The app is not live yet. The intern class is."
- "Drop your company. If 5 interns from the same company join, the pod unlocks."
- "NYC summer interns: this is your census."

## First 7 Days

### Day 1: Set Up Distribution Control

- Confirm Notion databases are live and match the fields in `campaign-hq-setup.md`.
- Create clean UTM/referral link templates.
- Create 20 captain prospect rows.
- Create 50 campus club/contact rows.
- Prepare three reusable assets: founder DM, captain invite, group chat drop.

### Day 2: Recruit First Captains

- Send 50 founder-led DMs.
- Invite 10 captain prospects.
- Ask every positive reply for school, company, and one chat they can access.
- Give each active captain a referral slug.

### Day 3: Start Club Outreach

- Contact 25 campus clubs.
- Prioritize clubs where students already share internship outcomes.
- Ask for a simple share, not a partnership call.
- Add every response to the Campus Club CRM.

### Day 4: Push First Pod Unlocks

- Review companies and schools with 2-4 signups.
- Send close-to-unlocking prompts.
- Ask users at companies/schools with 4 signups to invite one person.
- Draft Pulse #0 using aggregate counts.

### Day 5: Publish Social Proof

- Publish the first lightweight Pulse teaser.
- Do not overclaim. Use language like "forming," "showing up," and "close to unlocking."
- Feature aggregate counts only.
- Send captains their current totals and next ask.

### Day 6: Double Down On Working Sources

- Review signups by source and referrer.
- Pause channels with low verification quality.
- Increase outreach to the top two schools, companies, or source types.
- Recruit 5 more captains from the best-performing clusters.

### Day 7: Weekly Review

- Count verified interns, unlocked pods, close pods, unlocked school crews, and captain-driven signups.
- Decide next week's primary acquisition wedge.
- Publish a short update to make the map feel alive.

## Daily Notion Workflow

Every day, spend 30 minutes on operations:

1. Review new signups.
2. Normalize school and company names.
3. Mark verification status.
4. Update company pod and school crew counts.
5. Identify all companies and schools at 2-4 signups.
6. Send close-to-unlocking prompts.
7. Review captain performance.
8. Add one data point or quote to the next Pulse draft.
9. Queue tomorrow's highest-probability outreach.

## Success Metrics

Primary:
- Verified intern signups.
- Verified signups per captain.
- Company/school clusters reaching 5+ signups.
- Referral-driven signups.

Secondary:
- Landing page conversion rate.
- Signup-to-share-click rate.
- Club reply rate.
- DM positive reply rate.
- Repeat share behavior from captains.

Do not optimize for:
- Raw emails without verification.
- Social likes without signups.
- Broad audience awareness before the NYC wedge works.

## Message Discipline

Say:
- "NYC intern map"
- "NYC Intern Pulse"
- "company pods"
- "school crews"
- "add yourself"
- "unlock your pod"

Avoid leading with:
- "networking app"
- "professional community"
- "mentorship platform"
- "events app"
- "AI"
- "career platform"

The sharper story is: the intern class is forming, and users can put their company or school on the map before summer starts.
