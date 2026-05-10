export type Lead = {
  name: string;
  email: string;
  school: string;
  graduation_year: string;
  role: string;
  company: string;
  user_id: string;
  source: string;
  referrer: string;
  created_at: string;
  company_pod_status: string;
  school_crew_status: string;
  verification_status: string;
};

export type LivePulse = {
  interns: number;
  schools: number;
  companies: number;
  quests: number;
  updatedAt?: string;
};

export type PulseEvent = {
  area: string;
  title: string;
  description: string;
};

export const fallbackLivePulse: LivePulse = {
  interns: 286,
  schools: 38,
  companies: 51,
  quests: 42,
};

export const fallbackPulseEvents: PulseEvent[] = [
  {
    area: "Midtown",
    title: "18 interns joined a coffee walk",
    description: "A low-pressure loop from Bryant Park to Grand Central.",
  },
  {
    area: "Flatiron",
    title: "Deloitte lunch roulette is forming",
    description: "Small tables matched across consulting, finance, and tech.",
  },
  {
    area: "Hudson Yards",
    title: "Rooftop mixer needs 6 more",
    description:
      "After-work skyline meetup anchored by west-side company pods.",
  },
  {
    area: "West Village",
    title: "Founder chat opened 11 seats",
    description:
      "Casual product and startup conversation before internships begin.",
  },
  {
    area: "Lower East Side",
    title: "Welcome party is trending",
    description: "Weekend plan with 31 interested interns across school crews.",
  },
  {
    area: "Chelsea Piers",
    title: "Hudson run crew is live",
    description: "Morning route for interns who want a recurring fitness plan.",
  },
];
