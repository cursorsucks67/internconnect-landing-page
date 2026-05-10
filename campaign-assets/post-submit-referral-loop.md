# Post-Submit Referral Loop

Purpose: turn every signup into one clear share action.

## Post-Submit State

Headline:

> You are on the Manhattan intern map.

Body:

> Help unlock your company or school pod before the first Pulse drops.

Primary prompt:

> Invite 3 interns from your company to unlock your company pod.

Secondary prompt:

> Invite 5 interns from your school to put your school on the NYC map.

## Share Actions

Buttons:
- `Copy invite link`
- `Text your group chat`
- `Email a friend`

If only two buttons fit, use:
- `Copy invite link`
- `Email a friend`

## Referral Link Format

Personal invite:

```text
https://internconnected.com/?source=referral&ref={{referrer_slug}}
```

Captain invite:

```text
https://internconnected.com/?source=ambassador&ref={{captain_slug}}
```

Club invite:

```text
https://internconnected.com/?source=campus_club&ref={{club_slug}}
```

Group chat invite:

```text
https://internconnected.com/?source=group_chat&ref={{chat_slug}}
```

## Copy: Generic Invite

```text
I just joined Internconnected, the 2026 NYC intern map. Add yourself so we can see which companies, schools, and first-week plans are forming before summer starts:
{{invite_link}}
```

## Copy: Company Pod

```text
If you're interning at {{company}} in NYC this summer, add yourself to Internconnected. We need a few more people to unlock the {{company}} pod:
{{invite_link}}
```

## Copy: School Crew

```text
If you're from {{school}} and interning in NYC this summer, join Internconnected. We’re trying to put our school crew on the intern map:
{{invite_link}}
```

## Copy: Group Chat Drop

```text
NYC summer interns are mapping which companies, schools, and plans are forming before everyone arrives. Takes 20 seconds to add yourself:
{{invite_link}}
```

## Copy: High-Density Finance / Consulting

```text
For anyone interning in NYC this summer: Internconnected is mapping company pods and school crews before everyone arrives. Add yourself so your firm/school shows up in the first Pulse:
{{invite_link}}
```

## Triggered Follow-Up Prompts

Send these manually from the tracker.

### Company At 2 Signups

```text
{{company}} just showed up on the Internconnected map. If 3 more verified interns join, we’ll unlock the first {{company}} pod preview. Know anyone else interning there?
```

### Company At 4 Signups

```text
{{company}} is 1 intern away from unlocking a pod preview. Invite one coworker and we can put it in the next Pulse.
```

### School At 2 Signups

```text
{{school}} is now on the Internconnected map. If 3 more interns join, we’ll show the school crew in the next Pulse.
```

### School At 4 Signups

```text
{{school}} is 1 intern away from unlocking a school crew preview. Send this to one NYC intern from your school:
{{invite_link}}
```

## Referral Metrics

Track:
- Share prompt views
- Copy invite clicks
- Email friend clicks
- Signups by `ref`
- Verified signups by `ref`
- Company pods unlocked by referrals
- School crews unlocked by referrals

## Rules

- Do not add more signup fields before the share prompt.
- Do not ask for housing, preferences, or needs until after signup.
- Reward group progress, not individual popularity.
- Keep the language collective: “unlock your pod,” “put your school on the map,” “show up in the Pulse.”
