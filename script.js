const form = document.querySelector("#signup-form");
const sharePanel = document.querySelector("#share-panel");
const shareMessage = document.querySelector("#share-message");
const shareCopy = document.querySelector("#share-copy");
const copyLink = document.querySelector("#copy-link");
const mailtoLink = document.querySelector("#mailto-link");
const submitButton = document.querySelector("#submit-button");
const sourceField = document.querySelector("#source");
const referrerField = document.querySelector("#referrer");

const params = new URLSearchParams(window.location.search);
sourceField.value = params.get("source") || params.get("utm_source") || "direct";
referrerField.value = params.get("ref") || "";

const normalize = (value) => value.trim().replace(/\s+/g, " ");

const buildReferralSlug = (name, company) => {
  const base = `${name}-${company}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "intern";
};

const getStoredLeads = () => {
  try {
    return JSON.parse(localStorage.getItem("internconnected_leads") || "[]");
  } catch {
    return [];
  }
};

const storeLead = (lead) => {
  const leads = getStoredLeads();
  const existingIndex = leads.findIndex((item) => item.email === lead.email);
  if (existingIndex >= 0) {
    leads[existingIndex] = { ...leads[existingIndex], ...lead };
  } else {
    leads.push(lead);
  }
  localStorage.setItem("internconnected_leads", JSON.stringify(leads));
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());
  const lead = {
    name: normalize(data.name),
    email: normalize(data.email).toLowerCase(),
    school: normalize(data.school),
    graduation_year: normalize(data.graduation_year),
    role: normalize(data.role),
    company: normalize(data.company),
    source: data.source || "direct",
    referrer: data.referrer || "",
    created_at: new Date().toISOString(),
    company_pod_status: "pending",
    school_crew_status: "pending",
    verification_status: "unverified",
  };

  storeLead(lead);

  const slug = buildReferralSlug(lead.name, lead.company);
  const inviteUrl = `${window.location.origin}${window.location.pathname}?ref=${encodeURIComponent(slug)}&source=referral`;
  const message = `I just joined Internconnected, the 2026 NYC intern map. Add yourself so we can unlock our company and school pods: ${inviteUrl}`;

  shareMessage.textContent = `Invite 3 interns from ${lead.company} to unlock your company pod.`;
  shareCopy.value = message;
  mailtoLink.href = `mailto:?subject=${encodeURIComponent("Join the NYC intern map")}&body=${encodeURIComponent(message)}`;
  sharePanel.hidden = false;
  sharePanel.setAttribute("aria-hidden", "false");
  submitButton.textContent = "You are on the map";
  sharePanel.scrollIntoView({ behavior: "smooth", block: "center" });
});

copyLink.addEventListener("click", async () => {
  const text = shareCopy.value;
  try {
    await navigator.clipboard.writeText(text);
    copyLink.textContent = "Copied";
    copyLink.setAttribute("aria-label", "Invite message copied");
    window.setTimeout(() => {
      copyLink.textContent = "Copy invite link";
      copyLink.removeAttribute("aria-label");
    }, 1800);
  } catch {
    shareCopy.select();
  }
});
