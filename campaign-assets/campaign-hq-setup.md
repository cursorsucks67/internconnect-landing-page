# Campaign HQ Setup

Use this as the build checklist for the Notion/Airtable operating system.

## HQ Home

Sections:
- Today’s numbers
- This week’s target
- Pods close to unlocking
- School crews close to unlocking
- Captain actions needed
- Content shipping today
- Next Pulse draft

## Database 1: Signup Tracker

Purpose: source of truth for every intern.

Fields:
- `name`
- `email`
- `school`
- `graduation_year`
- `role`
- `company`
- `normalized_school`
- `normalized_company`
- `source`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `referrer`
- `referrer_slug`
- `created_at`
- `verification_status`
- `company_pod_status`
- `school_crew_status`
- `notes`

Views:
- All signups
- Needs verification
- Today’s signups
- By company
- By school
- By source
- Referral-driven signups

## Database 2: Company Pod Tracker

Purpose: identify pod unlock opportunities.

Fields:
- `company`
- `verified_intern_count`
- `total_signup_count`
- `pod_status`: not started, forming, close, unlocked
- `captain`
- `top_sources`
- `last_prompt_sent`
- `next_prompt`
- `notes`

Views:
- Pods close to unlocking
- Unlocked pods
- Finance/consulting pods
- Needs captain

Status rules:
- 0-1 verified: not started
- 2-3 verified: forming
- 4 verified: close
- 5+ verified: unlocked

## Database 3: School Crew Tracker

Purpose: identify school-based distribution loops.

Fields:
- `school`
- `verified_intern_count`
- `total_signup_count`
- `crew_status`: not started, forming, close, unlocked
- `captain`
- `clubs_contacted`
- `last_prompt_sent`
- `next_prompt`
- `notes`

Views:
- Crews close to unlocking
- Unlocked crews
- Needs club outreach
- Needs captain

Status rules:
- 0-1 verified: not started
- 2-3 verified: forming
- 4 verified: close
- 5+ verified: unlocked

## Database 4: Founding Intern Captain Tracker

Purpose: manage ambassador-style distribution without paying for junk leads.

Fields:
- `name`
- `email`
- `school`
- `company`
- `channels`
- `personal_referral_slug`
- `signup_target`
- `verified_signups_driven`
- `group_chat_drops`
- `social_posts`
- `status`: prospect, invited, active, paused, done
- `last_contacted`
- `next_ask`
- `notes`

Views:
- Active captains
- Prospects to invite
- Needs follow-up
- Top performers

## Database 5: Campus Club CRM

Purpose: run structured outreach to school organizations.

Fields:
- `school`
- `club_name`
- `category`: finance, consulting, business, tech, professional fraternity, affinity group
- `contact_name`
- `contact_email`
- `linkedin_url`
- `instagram_url`
- `outreach_status`: not started, drafted, sent, replied, partnered, declined
- `last_contacted`
- `next_step`
- `notes`

Views:
- Priority clubs
- Needs first message
- Awaiting reply
- Partnered clubs

## Database 6: Content Calendar

Purpose: ship daily assets tied to signup goals.

Fields:
- `date`
- `channel`
- `asset_type`
- `hook`
- `copy`
- `cta`
- `owner`
- `status`: idea, drafted, approved, posted, measured
- `source_link`
- `result_signups`
- `notes`

Views:
- This week
- Needs draft
- Ready to post
- Posted and needs results

## Database 7: Weekly NYC Intern Pulse

Purpose: produce the public artifact that makes sharing worthwhile.

Fields:
- `week`
- `verified_intern_count`
- `top_schools`
- `top_companies`
- `top_roles`
- `pods_close_to_unlocking`
- `school_crews_close_to_unlocking`
- `first_week_plans_forming`
- `cta`
- `publish_status`
- `published_link`

Views:
- Current draft
- Published Pulses
- Needs data

## Daily Operating Ritual

Spend 30 minutes daily:

1. Normalize new schools and companies.
2. Mark obvious verification status.
3. Update company and school counts.
4. Identify all companies/schools at 2-4 signups.
5. Send close-to-unlocking prompts.
6. Check captain performance.
7. Add one insight to the next Pulse.
8. Queue the next day’s highest-probability outreach.

## Weekly Operating Ritual

Every Friday:

1. Publish the Pulse.
2. Feature top schools and companies.
3. Highlight pods close to unlocking.
4. Send captains their personal performance recap.
5. Decide next week’s primary acquisition wedge.
