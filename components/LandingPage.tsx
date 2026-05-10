"use client";

import {
  Coffee,
  Dumbbell,
  Martini,
  MessageCircle,
  PartyPopper,
  Spade,
  Utensils,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import {
  fallbackLivePulse,
  fallbackPulseEvents,
  type Lead,
  type LivePulse,
  type PulseEvent,
} from "../lib/pulse";

const normalize = (value: FormDataEntryValue | null) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");

const createUserId = () => crypto.randomUUID().replaceAll("-", "");

type MapPoint = {
  lat: number;
  lng: number;
};

type ShareState = {
  company: string;
  message: string;
  note: string;
  mailtoHref: string;
};

type EventIconName =
  | "coffee"
  | "poker"
  | "lunch"
  | "mixer"
  | "run"
  | "chat"
  | "party";

type MapMarker = MapPoint & {
  kind: "company" | "event";
  name: string;
  detail: string;
  className: string;
  icon?: EventIconName;
};

const companyMarkers: MapMarker[] = [
  {
    kind: "company",
    name: "BlackRock",
    detail: "19 interns",
    lat: 40.7543,
    lng: -74.0006,
    className: "pin-blk",
  },
  {
    kind: "company",
    name: "Deloitte",
    detail: "27 interns",
    lat: 40.7587,
    lng: -73.9792,
    className: "pin-dlt",
  },
  {
    kind: "company",
    name: "JPMorgan",
    detail: "31 interns",
    lat: 40.7558,
    lng: -73.9752,
    className: "pin-jpm",
  },
  {
    kind: "company",
    name: "Goldman",
    detail: "22 interns",
    lat: 40.7147,
    lng: -74.0141,
    className: "pin-gs",
  },
  {
    kind: "company",
    name: "Morgan Stanley",
    detail: "16 interns",
    lat: 40.7602,
    lng: -73.9859,
    className: "pin-ms",
  },
  {
    kind: "company",
    name: "Citi",
    detail: "14 interns",
    lat: 40.7411,
    lng: -74.0048,
    className: "pin-citi",
  },
  {
    kind: "company",
    name: "Google",
    detail: "18 interns",
    lat: 40.7414,
    lng: -74.0034,
    className: "pin-google",
  },
  {
    kind: "company",
    name: "Meta",
    detail: "11 interns",
    lat: 40.7308,
    lng: -73.9917,
    className: "pin-meta",
  },
  {
    kind: "company",
    name: "McKinsey",
    detail: "13 interns",
    lat: 40.7621,
    lng: -73.9738,
    className: "pin-mck",
  },
  {
    kind: "company",
    name: "BofA",
    detail: "15 interns",
    lat: 40.7556,
    lng: -73.9849,
    className: "pin-bofa",
  },
];

const eventMarkers: MapMarker[] = [
  {
    kind: "event",
    name: "Coffee walk",
    detail: "18",
    lat: 40.7536,
    lng: -73.9832,
    className: "event-coffee",
    icon: "coffee",
  },
  {
    kind: "event",
    name: "Poker night",
    detail: "12",
    lat: 40.7427,
    lng: -73.9896,
    className: "event-poker",
    icon: "poker",
  },
  {
    kind: "event",
    name: "Lunch roulette",
    detail: "9",
    lat: 40.7359,
    lng: -73.9911,
    className: "event-lunch",
    icon: "lunch",
  },
  {
    kind: "event",
    name: "Rooftop mixer",
    detail: "24",
    lat: 40.7484,
    lng: -73.9857,
    className: "event-mixer",
    icon: "mixer",
  },
  {
    kind: "event",
    name: "Hudson run",
    detail: "14",
    lat: 40.7472,
    lng: -74.0068,
    className: "event-run",
    icon: "run",
  },
  {
    kind: "event",
    name: "Founder chat",
    detail: "11",
    lat: 40.7282,
    lng: -74.0007,
    className: "event-chat",
    icon: "chat",
  },
  {
    kind: "event",
    name: "Welcome party",
    detail: "31",
    lat: 40.7216,
    lng: -73.9872,
    className: "event-party",
    icon: "party",
  },
];

const getStoredLeads = () => {
  try {
    return JSON.parse(
      localStorage.getItem("internconnected_leads") || "[]",
    ) as Lead[];
  } catch {
    return [];
  }
};

const storeLead = (lead: Lead) => {
  const leads = getStoredLeads();
  const existingIndex = leads.findIndex((item) => item.email === lead.email);

  if (existingIndex >= 0) {
    leads[existingIndex] = { ...leads[existingIndex], ...lead };
  } else {
    leads.push(lead);
  }

  localStorage.setItem("internconnected_leads", JSON.stringify(leads));
};

const tileSize = 256;
const mapWheelZoomStep = 0.28;

const project = ({ lat, lng }: MapPoint, zoom: number) => {
  const sin = Math.sin((lat * Math.PI) / 180);
  const scale = tileSize * 2 ** zoom;

  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
};

const unproject = (
  { x, y }: { x: number; y: number },
  zoom: number,
): MapPoint => {
  const scale = tileSize * 2 ** zoom;
  const lng = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));

  return { lat, lng };
};

const EventMarkerIcon = ({ icon }: { icon?: EventIconName }) => {
  if (icon === "coffee") return <Coffee aria-hidden="true" strokeWidth={3} />;
  if (icon === "poker") return <Spade aria-hidden="true" strokeWidth={3} />;
  if (icon === "lunch") return <Utensils aria-hidden="true" strokeWidth={3} />;
  if (icon === "mixer") return <Martini aria-hidden="true" strokeWidth={3} />;
  if (icon === "run") return <Dumbbell aria-hidden="true" strokeWidth={3} />;
  if (icon === "chat")
    return <MessageCircle aria-hidden="true" strokeWidth={3} />;
  if (icon === "party")
    return <PartyPopper aria-hidden="true" strokeWidth={3} />;
  return null;
};

const InternMap = ({
  variant,
  className,
  ariaLabel,
}: {
  variant: "hero" | "mini";
  className: string;
  ariaLabel: string;
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const activePointer = useRef<{
    id: number;
    x: number;
    y: number;
    centerPoint: { x: number; y: number };
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(variant === "mini" ? 13.8 : 13.6);
  const [center, setCenter] = useState<MapPoint>(
    variant === "mini"
      ? { lat: 40.7435, lng: -73.9924 }
      : { lat: 40.739, lng: -73.992 },
  );
  const [size, setSize] = useState({ width: 1, height: 1 });
  const markers = useMemo(
    () => (variant === "mini" ? eventMarkers : companyMarkers),
    [variant],
  );

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleWheel = (event: WheelEvent) => {
      if (!map.contains(document.activeElement)) return;

      event.preventDefault();
      const delta = Math.max(-1, Math.min(1, event.deltaY / 100));
      if (delta === 0) return;

      setZoom((currentZoom) =>
        Math.min(16, Math.max(11, currentZoom - delta * mapWheelZoomStep)),
      );
    };
    const updateSize = () => {
      const rect = map.getBoundingClientRect();
      setSize({
        width: Math.max(rect.width, 1),
        height: Math.max(rect.height, 1),
      });
    };
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(map);
    map.addEventListener("wheel", handleWheel, { passive: false });
    updateSize();

    return () => {
      resizeObserver.disconnect();
      map.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const { markerViews, tiles } = useMemo(() => {
    const tileZoom = Math.round(zoom);
    const zoomScale = 2 ** (zoom - tileZoom);
    const centerPoint = project(center, tileZoom);
    const topLeft = {
      x: centerPoint.x - size.width / (2 * zoomScale),
      y: centerPoint.y - size.height / (2 * zoomScale),
    };
    const startX = Math.floor(topLeft.x / tileSize);
    const endX = Math.floor((topLeft.x + size.width / zoomScale) / tileSize);
    const startY = Math.floor(topLeft.y / tileSize);
    const endY = Math.floor((topLeft.y + size.height / zoomScale) / tileSize);
    const tileCount = 2 ** tileZoom;
    const nextTiles: Array<{
      key: string;
      src: string;
      left: number;
      top: number;
      size: number;
    }> = [];

    for (let x = startX; x <= endX; x += 1) {
      for (let y = startY; y <= endY; y += 1) {
        if (y < 0 || y >= tileCount) continue;

        const wrappedX = ((x % tileCount) + tileCount) % tileCount;
        const subdomain = ["a", "b", "c"][Math.abs(wrappedX + y) % 3];
        nextTiles.push({
          key: `${tileZoom}-${wrappedX}-${y}`,
          src: `https://${subdomain}.basemaps.cartocdn.com/rastertiles/voyager/${tileZoom}/${wrappedX}/${y}@2x.png`,
          left: Math.round((x * tileSize - topLeft.x) * zoomScale),
          top: Math.round((y * tileSize - topLeft.y) * zoomScale),
          size: Math.ceil(tileSize * zoomScale) + 1,
        });
      }
    }

    const markerViews = markers.map((marker) => {
      const point = project(marker, tileZoom);
      return {
        marker,
        left: (point.x - topLeft.x) * zoomScale,
        top: (point.y - topLeft.y) * zoomScale,
      };
    });

    return { markerViews, tiles: nextTiles };
  }, [center, markers, size.height, size.width, zoom]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.focus();
    activePointer.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      centerPoint: project(center, zoom),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const pointer = activePointer.current;
    if (!pointer || pointer.id !== event.pointerId) return;

    setCenter(
      unproject(
        {
          x: pointer.centerPoint.x - (event.clientX - pointer.x),
          y: pointer.centerPoint.y - (event.clientY - pointer.y),
        },
        zoom,
      ),
    );
  };

  const endPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!activePointer.current || activePointer.current.id !== event.pointerId)
      return;
    activePointer.current = null;
    setIsDragging(false);
  };

  return (
    <div
      ref={mapRef}
      className={`${className} interactive-map${isDragging ? " is-dragging" : ""}`}
      role="img"
      aria-label={ariaLabel}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
    >
      <div className="map-tile-layer">
        {tiles.map((tile) => (
          <img
            key={tile.key}
            className="map-tile"
            src={tile.src}
            alt=""
            decoding="async"
            draggable={false}
            style={{
              left: tile.left,
              top: tile.top,
              height: tile.size,
              width: tile.size,
            }}
          />
        ))}
      </div>
      <div className="map-marker-layer">
        {markerViews.map(({ marker, left, top }) => (
          <span
            key={`${marker.kind}-${marker.name}`}
            className={
              marker.kind === "company"
                ? `signal-pin company-pin ${marker.className}`
                : `event-pin ${marker.className}`
            }
            style={{ left, top }}
          >
            <i>
              {marker.kind === "event" ? (
                <EventMarkerIcon icon={marker.icon} />
              ) : null}
            </i>
            <b>{marker.name}</b>
            <small>{marker.detail}</small>
          </span>
        ))}
      </div>
      <a
        className="map-attribution"
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noreferrer"
      >
        © CARTO · OSM
      </a>
    </div>
  );
};

export default function LandingPage() {
  const [livePulse, setLivePulse] = useState<LivePulse>(fallbackLivePulse);
  const [liveEvents, setLiveEvents] =
    useState<PulseEvent[]>(fallbackPulseEvents);
  const [source, setSource] = useState("direct");
  const [referrer, setReferrer] = useState("");
  const [shareState, setShareState] = useState<ShareState | null>(null);
  const [copyStatus, setCopyStatus] = useState("Copy invite link");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshPulse = async () => {
    try {
      const response = await fetch("/api/pulse", { cache: "no-store" });
      if (!response.ok) return;

      const data = (await response.json()) as {
        pulse?: LivePulse;
        events?: PulseEvent[];
      };

      if (data.pulse) setLivePulse(data.pulse);
      if (Array.isArray(data.events) && data.events.length > 0) {
        setLiveEvents(data.events);
      }
    } catch {
      setLivePulse(fallbackLivePulse);
      setLiveEvents(fallbackPulseEvents);
    }
  };

  useEffect(() => {
    void refreshPulse();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSource(params.get("source") || params.get("utm_source") || "direct");
    setReferrer(params.get("ref") || "");
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const data = new FormData(event.currentTarget);
    const lead: Lead = {
      name: normalize(data.get("name")),
      email: normalize(data.get("email")).toLowerCase(),
      school: normalize(data.get("school")),
      graduation_year: normalize(data.get("graduation_year")),
      role: normalize(data.get("role")),
      company: normalize(data.get("company")),
      user_id: createUserId(),
      source: normalize(data.get("source")) || "direct",
      referrer: normalize(data.get("referrer")),
      created_at: new Date().toISOString(),
      company_pod_status: "pending",
      school_crew_status: "pending",
      verification_status: "unverified",
    };

    storeLead(lead);
    let savedToNotion = false;
    let userId = lead.user_id;

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lead),
      });

      if (response.ok) {
        const result = (await response.json()) as {
          notionConfigured?: boolean;
          userId?: string;
        };
        savedToNotion = Boolean(result.notionConfigured);
        userId = result.userId || userId;
        void refreshPulse();
      }
    } catch {
      // The browser backup keeps the invite loop working during local setup.
    }

    const inviteUrl = `${window.location.origin}${window.location.pathname}?ref=${encodeURIComponent(
      userId,
    )}&source=referral`;
    const message = `I just joined Internconnected, the 2026 NYC intern map. Add yourself so we can unlock our company and school pods: ${inviteUrl}`;
    const note = savedToNotion
      ? `Invite 3 interns from ${lead.company} to unlock your company pod. Your signup is now feeding the live Pulse.`
      : `Invite 3 interns from ${lead.company} to unlock your company pod.`;

    setShareState({
      company: lead.company,
      message,
      note,
      mailtoHref: `mailto:?subject=${encodeURIComponent(
        "Join the NYC intern map",
      )}&body=${encodeURIComponent(message)}`,
    });
    setCopyStatus("Copy invite link");
    setIsSubmitting(false);
  };

  const handleCopy = async () => {
    if (!shareState) return;

    try {
      await navigator.clipboard.writeText(shareState.message);
      setCopyStatus("Copied");
      window.setTimeout(() => setCopyStatus("Copy invite link"), 1800);
    } catch {
      setCopyStatus("Select text below");
    }
  };

  return (
    <>
      <header className="site-nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Internconnected home">
          <span className="brand-mark" aria-hidden="true">
            ic
          </span>
          <span>Internconnected</span>
        </a>
        <nav aria-label="Page sections">
          <a href="#pulse">City Pulse</a>
          <a href="#pods">Pods</a>
          <a href="#join">Join</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="city-stage" aria-hidden="true">
            <div className="manhattan-signal">
              <div className="signal-panel">
                <div className="signal-topline">
                  <span>NYC intern signal</span>
                </div>
                <div className="signal-map static-map-frame">
                  <img
                    className="static-map-image"
                    src="/company-signal.png"
                    alt="NYC company pod map with BlackRock, Morgan Stanley, McKinsey, BofA, JPMorgan, Google, Meta, and Goldman pins"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="hero-copy">
            <p className="eyebrow">2026 NYC Intern Census</p>
            <h1 id="hero-title">NYC’s intern class is getting connected.</h1>
            <p className="hero-lede">
              Add yourself to the verified NYC intern signal and watch company
              pods, school crews, and plans pulse around the city.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#join">
                Join Internconnected
              </a>
              <a className="button secondary" href="#pulse">
                See the Pulse
              </a>
            </div>
            <p className="concept-note">
              Early access opens as school and company pods unlock.
            </p>
          </div>
        </section>

        <section className="ticker" aria-label="City Pulse activity">
          <p>
            <strong>Live Pulse:</strong> {livePulse.interns} people ·{" "}
            {livePulse.schools} schools · {livePulse.companies} companies
            represented.
          </p>
        </section>

        <section
          id="pulse"
          className="section vision-section"
          aria-labelledby="vision-title"
        >
          <div className="section-heading map-story-heading">
            <p className="eyebrow">How the City Pulse works</p>
            <h2 id="vision-title">
              Turn your intern class into a living city map.
            </h2>
            <p>
              Every signup, invite, plan, and company push changes what appears
              on the map.
            </p>
          </div>

          <div
            className="signal-grid"
            aria-label="Internconnected city mechanics"
          >
            <article className="signal-card pulse-card">
              <div className="pulse-card-header">
                <span className="card-kicker">City Pulse</span>
                <h3>Every invite changes the city.</h3>
              </div>
              <div className="pulse-card-layout">
                <div className="mini-signal-map static-map-frame">
                  <img
                    className="static-map-image"
                    src="/event-signal.png"
                    alt="NYC event pulse map with Hudson run, coffee walk, rooftop mixer, poker night, lunch roulette, founder chat, and welcome party pins"
                  />
                </div>
                <div
                  className="pulse-event-list"
                  aria-label="Live event signals"
                >
                  {liveEvents.map((event) => (
                    <article className="pulse-event-card" key={event.title}>
                      <span>{event.area}</span>
                      <strong>{event.title}</strong>
                      <p>{event.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </article>

            <article className="signal-card faction-card">
              <span className="card-kicker">Company Poker</span>
              <h3>Ante up and outplay the other intern desks.</h3>
              <div className="faction-arena" aria-hidden="true">
                <div className="competition-table">
                  <div className="table-center">
                    <span>Table leader</span>
                    <strong>JPM owns the pot</strong>
                  </div>
                  <div className="chip-stack stack-jpm">
                    <i />
                    <i />
                    <i />
                    <b>JPM</b>
                    <small>$3.1K</small>
                  </div>
                  <div className="chip-stack stack-dlt">
                    <i />
                    <i />
                    <b>DLT</b>
                    <small>$2.7K</small>
                  </div>
                  <div className="chip-stack stack-gs">
                    <i />
                    <i />
                    <b>GS</b>
                    <small>$2.2K</small>
                  </div>
                  <div className="chip-stack stack-blk">
                    <i />
                    <b>BLK</b>
                    <small>$1.9K</small>
                  </div>
                </div>
              </div>
              <p>
                Join your company table, stack chips with other interns, and win
                the week.
              </p>
            </article>

            <article className="signal-card leaderboard-card">
              <span className="card-kicker">Crew Leaderboard</span>
              <h3>Work with fellow interns and climb to the top.</h3>
              <div className="faction-board">
                <div>
                  <span>JPMorgan</span>
                  <i style={{ "--w": "86%" } as CSSProperties} />
                  <b>86</b>
                </div>
                <div>
                  <span>Deloitte</span>
                  <i style={{ "--w": "74%" } as CSSProperties} />
                  <b>74</b>
                </div>
                <div>
                  <span>Goldman</span>
                  <i style={{ "--w": "62%" } as CSSProperties} />
                  <b>62</b>
                </div>
                <div>
                  <span>BlackRock</span>
                  <i style={{ "--w": "55%" } as CSSProperties} />
                  <b>55</b>
                </div>
              </div>
              <div className="metric-grid">
                <div>
                  <span>Hangouts</span>
                  <strong>42</strong>
                </div>
                <div>
                  <span>Coffee chats</span>
                  <strong>118</strong>
                </div>
                <div>
                  <span>Lunch crews</span>
                  <strong>27</strong>
                </div>
                <div>
                  <span>Invites sent</span>
                  <strong>{livePulse.interns}</strong>
                </div>
              </div>
              <p>
                Rally your pod through hangouts, coffee chats, and small plans
                that move your crew up the board.
              </p>
            </article>

            <article className="signal-card quest-card">
              <span className="card-kicker">Quest Sparks</span>
              <h3>Find plans without awkward group chats.</h3>
              <div className="quest-stack">
                <div>
                  <span>Tonight</span>
                  <strong>Cross-company coffee walk</strong>
                  <small>Midtown · 18 interested</small>
                </div>
                <div>
                  <span>Saturday</span>
                  <strong>Lunch roulette</strong>
                  <small>Flatiron · 9 matched</small>
                </div>
                <div>
                  <span>Unlock</span>
                  <strong>Invite 2 interns to open your pod</strong>
                  <small>Company push</small>
                </div>
              </div>
              <p>
                Walk into week one with easy invites, small plans, and people to
                meet before the internship gets busy.
              </p>
            </article>
          </div>
        </section>

        <section
          id="pods"
          className="section pod-section"
          aria-labelledby="pods-title"
        >
          <div className="section-heading compact">
            <p className="eyebrow">Company pods and school crews</p>
            <h2 id="pods-title">Add yourself once. Help your circle appear.</h2>
          </div>
          <div className="pod-grid">
            <article className="pod-card">
              <span className="pod-type">Company pod</span>
              <h3>JPMorgan</h3>
              <p>1 more intern needed to unlock the pod.</p>
              <div
                className="progress"
                data-label="4 of 5"
                aria-label="JPMorgan pod is 80 percent unlocked"
              >
                <span style={{ width: "80%" }} />
              </div>
            </article>
            <article className="pod-card">
              <span className="pod-type">School crew</span>
              <h3>NYU</h3>
              <p>18 interns are already represented in the sample Pulse.</p>
              <div
                className="progress"
                data-label="Unlocked"
                aria-label="NYU crew is 100 percent unlocked"
              >
                <span style={{ width: "100%" }} />
              </div>
            </article>
            <article className="pod-card">
              <span className="pod-type">Company pod</span>
              <h3>Deloitte</h3>
              <p>Invite one more intern to push this pod over the line.</p>
              <div
                className="progress"
                data-label="4 of 5"
                aria-label="Deloitte pod is 80 percent unlocked"
              >
                <span style={{ width: "80%" }} />
              </div>
            </article>
            <article className="pod-card">
              <span className="pod-type">School crew</span>
              <h3>Columbia</h3>
              <p>
                9 interns and counting across consulting, finance, and tech.
              </p>
              <div
                className="progress"
                data-label="7 of 10"
                aria-label="Columbia crew is 70 percent unlocked"
              >
                <span style={{ width: "70%" }} />
              </div>
            </article>
          </div>
        </section>

        <section
          id="join"
          className="section join-section"
          aria-labelledby="join-title"
        >
          <div className="join-copy">
            <p className="eyebrow">Join early</p>
            <h2 id="join-title">Put yourself on the NYC intern map.</h2>
            <p>
              Six fields, under 30 seconds. After you join, invite interns from
              your company or school to help unlock the first pods.
            </p>
          </div>

          {shareState ? (
            <aside id="share-panel" className="share-panel" aria-live="polite">
              <p className="eyebrow">You are on the list</p>
              <h3>Help unlock your pod.</h3>
              <p id="share-message">{shareState.note}</p>
              <div className="share-actions">
                <button
                  className="button secondary"
                  id="copy-link"
                  type="button"
                  onClick={handleCopy}
                >
                  {copyStatus}
                </button>
                <a
                  className="button primary"
                  id="mailto-link"
                  href={shareState.mailtoHref}
                >
                  Email a friend
                </a>
              </div>
              <label className="share-copy-label" htmlFor="share-copy">
                Invite message
              </label>
              <textarea id="share-copy" readOnly value={shareState.message} />
            </aside>
          ) : (
            <form
              id="signup-form"
              className="signup-form"
              aria-label="Join Internconnected signup form"
              aria-describedby="form-note privacy-note"
              onSubmit={handleSubmit}
            >
              <input type="hidden" id="source" name="source" value={source} />
              <input
                type="hidden"
                id="referrer"
                name="referrer"
                value={referrer}
              />
              <p className="form-note" id="form-note">
                All fields are required.
              </p>
              <label>
                Name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  placeholder="Jordan Lee"
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="jordan@school.edu"
                />
              </label>
              <label>
                School
                <input name="school" required placeholder="NYU" />
              </label>
              <label>
                Graduation year
                <input
                  name="graduation_year"
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  required
                  placeholder="2027"
                />
              </label>
              <label>
                Internship role
                <input
                  name="role"
                  required
                  placeholder="Investment Banking Summer Analyst"
                />
              </label>
              <label>
                Company
                <input name="company" required placeholder="JPMorgan" />
              </label>
              <button
                className="button primary form-button"
                id="submit-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Joining..." : "Join Internconnected"}
              </button>
              <p className="privacy-note" id="privacy-note">
                No public profile is created from this form. Your signup helps
                unlock school and company pods.
              </p>
            </form>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <span>Internconnected</span>
        <span>Built for the 2026 NYC intern cohort.</span>
      </footer>
    </>
  );
}
