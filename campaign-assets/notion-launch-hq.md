# Internconnected Launch HQ

Use this as the top-level Notion workspace for the pre-build campaign.

## Mission

Get as many verified summer 2026 NYC interns as possible to join Internconnected before the product exists. The first action is intentionally small: name, email, school, graduation year, role, company.

## Weekly Targets

| Week | Dates | Target | Primary job |
| --- | --- | ---: | --- |
| 1 | May 9-15 | 100 verified interns | Build assets and seed captains |
| 2 | May 16-22 | 300 verified interns | Launch the NYC Intern Census |
| 3 | May 23-29 | 600 verified interns | Push company and school pod unlocks |
| 4 | May 30-June 5 | 900 verified interns | Publish first real NYC Intern Pulse |
| 5 | June 6-12 | 1,200 verified interns | Turn traction into social proof |
| 6 | June 13-19 | 1,500 verified interns | Decide first product surface |

## Databases To Create

Use the companion files in this folder to create the first version:
- `signup-tracker-template.csv`
- `daily-metrics-dashboard.csv`
- `company-pod-tracker-template.csv`
- `school-crew-tracker-template.csv`
- `source-tracker-template.csv`
- `funnel-instrumentation.md`
- `post-submit-referral-loop.md`
- `campaign-hq-setup.md`

### Signup Tracker

Properties:
- Name
- Email
- School
- Graduation year
- Role
- Company
- Normalized school
- Normalized company
- Source
- UTM source
- UTM medium
- UTM campaign
- UTM content
- Referrer
- Referrer slug
- Verification status
- Company pod status
- School crew status
- Created at

Views:
- All signups
- By company
- By school
- Needs verification
- Referral source leaderboard

### Company Pod Tracker

Properties:
- Company
- Verified intern count
- Pod status: not started, close, unlocked
- Captain
- Last prompt sent
- Notes

Unlock rule:
- 5 verified interns from one company unlock the first pod preview.

### School Crew Tracker

Properties:
- School
- Verified intern count
- Crew status: not started, close, unlocked
- Captain
- Last prompt sent
- Notes

Unlock rule:
- 5 verified interns from one school unlock the first school crew preview.

### Founding Intern Captain Tracker

Properties:
- Name
- Email
- School
- Company
- Channels they can access
- Signup target
- Verified signups driven
- Status: prospect, invited, active, paused
- Notes

### Content Calendar

Properties:
- Date
- Channel
- Asset type
- Hook
- CTA
- Status
- Link
- Results

Daily operating rule:
- Every published asset must ask interns to add themselves or share the map with a company/school group chat.

### NYC Intern Pulse Builder

Properties:
- Week
- Verified intern count
- Top schools
- Top companies
- Top roles
- Pods close to unlocking
- School crews close to unlocking
- CTA
- Publish status

## Daily Checklist

- Review new signups.
- Normalize company and school names.
- Update pod and school crew counts.
- Identify companies and schools with 2-4 signups.
- Send close-to-unlocking prompts.
- Add new content ideas from signup patterns.
- Update the next Pulse draft.
- Ask active captains for one specific share action.
