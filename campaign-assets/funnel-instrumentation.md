# Internconnected Funnel Instrumentation

Purpose: make every signup traceable to a channel, referrer, school, company, and pod unlock opportunity.

## Funnel Events

Track these events from day one:

| Event | Trigger | Required fields | Why it matters |
| --- | --- | --- | --- |
| `page_view` | User lands on the site | source, referrer, landing_url, created_at | Measures traffic quality by channel |
| `cta_click` | User clicks Join Internconnected | source, referrer, cta_location, created_at | Shows whether the page creates intent |
| `signup_started` | User focuses first form field | source, referrer, created_at | Finds form drop-off |
| `signup_completed` | User submits six fields | all signup fields, source, referrer, created_at | Core conversion event |
| `share_prompt_viewed` | Post-submit panel appears | company, school, referrer_slug | Measures referral loop exposure |
| `invite_copy_clicked` | User clicks copy invite link | company, school, referrer_slug | Measures share intent |
| `email_friend_clicked` | User clicks email link | company, school, referrer_slug | Measures share intent |

## Required Signup Record

Public fields:
- `name`
- `email`
- `school`
- `graduation_year`
- `role`
- `company`

Hidden/internal fields:
- `source`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `referrer`
- `referrer_slug`
- `created_at`
- `landing_url`
- `verification_status`
- `company_pod_status`
- `school_crew_status`

## Source Rules

Use simple source names so attribution stays readable:

| Source | Use for |
| --- | --- |
| `direct` | No visible source |
| `referral` | User came through a personal invite link |
| `group_chat` | WhatsApp, iMessage, Discord, GroupMe, Slack |
| `linkedin` | Founder posts, intern posts, comments, DMs |
| `tiktok` | Organic TikTok |
| `instagram` | Reels, stories, DMs |
| `campus_club` | Club email/newsletter/group chat |
| `ambassador` | Founding Intern Captain links |
| `reddit` | Reddit/resource posts |
| `wso` | Wall Street Oasis/forum posts |

## UTM Link Format

Use this structure:

```text
https://internconnected.com/?utm_source=linkedin&utm_medium=organic&utm_campaign=nyc_census&utm_content=founder_post_01
```

For captains:

```text
https://internconnected.com/?source=ambassador&ref=first-last-school
```

For group chats:

```text
https://internconnected.com/?source=group_chat&ref=nyu-finance-chat
```

## Daily Funnel Review

Every day, answer:
- How many visitors became signups?
- Which source drove the most verified interns?
- Which source drove the highest conversion rate?
- Which schools reached 2, 3, 4, or 5 signups?
- Which companies reached 2, 3, 4, or 5 signups?
- Which captains drove verified signups, not just clicks?
- Which close-to-unlocking prompts should go out today?

## Minimum Dashboard Views

Create these views in Airtable/Notion:

1. **Daily Overview**
   Visitors, signups, verified signups, conversion rate, referrals.

2. **Company Pod Watchlist**
   Companies with 2-4 interns. These get targeted prompts.

3. **School Crew Watchlist**
   Schools with 2-4 interns. These get targeted prompts.

4. **Source Quality**
   Source, visits, signups, verified signups, conversion rate.

5. **Captain Performance**
   Captain, verified signups, active channels, last action, next ask.

## Quality Rules

- Optimize for verified interns, not raw emails.
- Normalize company names daily. Example: `J.P. Morgan`, `JP Morgan`, and `JPMorgan` should become `JPMorgan`.
- Normalize school names daily. Example: `NYU`, `New York University`, and `Stern` should map to `NYU`.
- Do not publish personal data in Pulse without explicit opt-in.
- Treat company/school counts below 5 as directional, not public proof.
