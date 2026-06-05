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
import { useEffect, useMemo, useRef, useState } from "react";
import {
  fallbackLivePulse,
  fallbackPulseEvents,
  type LivePulse,
  type PulseEvent,
} from "../lib/pulse";

type MapPoint = {
  lat: number;
  lng: number;
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

const AppStoreDownloadButton = ({ className = "" }: { className?: string }) => (
  <a
    aria-label="Download on the App Store"
    className={`app-store-button ${className}`.trim()}
    href="/download"
  >
    <img alt="" aria-hidden="true" src="/apple-download.svg" />
  </a>
);

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

  return (
    <>
      <header className="site-nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Spark: Find Your Crew home">
          <img
            alt=""
            aria-hidden="true"
            className="brand-logo"
            src="/spark-logo.jpg"
          />
          <span>Spark: Find Your Crew</span>
        </a>
        <nav aria-label="Page sections">
          <a href="#pulse">City Pulse</a>
          <a href="#pods">Pods</a>
          <a href="#download">Download</a>
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
              Download the app for the verified NYC intern signal, then find
              company pods, school crews, and plans pulsing around the city.
            </p>
            <div className="hero-actions">
              <AppStoreDownloadButton />
              <a className="button secondary" href="#pulse">
                See the Pulse
              </a>
            </div>
            <p className="concept-note">
              Built for summer interns finding their people in New York.
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
            aria-label="Spark: Find Your Crew city mechanics"
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
              <figure className="feature-art-frame">
                <img
                  src="/company-poker.png?v=5"
                  alt="Illustrated company poker table with readable company chip stacks"
                />
              </figure>
              <p>
                Join your company table, stack chips with other interns, and win
                the week.
              </p>
            </article>

            <article className="signal-card leaderboard-card">
              <span className="card-kicker">Crew Leaderboard</span>
              <h3>Work with fellow interns and climb to the top.</h3>
              <figure className="feature-art-frame">
                <img
                  src="/crew-leaderboard.png?v=3"
                  alt="Illustrated crew leaderboard dashboard with company rankings"
                />
              </figure>
              <p>
                Rally your pod through hangouts, coffee chats, and small plans
                that move your crew up the board.
              </p>
            </article>

            <article className="signal-card quest-card">
              <span className="card-kicker">Quest Sparks</span>
              <h3>Find plans without awkward group chats.</h3>
              <figure className="feature-art-frame quest-art-frame">
                <img
                  src="/quest-sparks.png"
                  alt="Illustrated quest board with coffee, lunch, and invite unlock routes"
                />
              </figure>
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
          id="download"
          className="section join-section"
          aria-labelledby="join-title"
        >
          <div className="join-copy">
            <p className="eyebrow">Available now</p>
            <h2 id="join-title">Bring the NYC intern map with you.</h2>
            <p>
              Spark: Find Your Crew is live on the App Store. Download it to
              join your pod, discover nearby Sparks, and meet interns around
              the city.
            </p>
          </div>

          <aside className="download-card" aria-label="Download Spark: Find Your Crew">
            <p className="eyebrow">iPhone app</p>
            <h3>Start finding your crew today.</h3>
            <p>
              Open the App Store listing, install Spark, and use your invite
              links to bring friends into your Cards.
            </p>
            <AppStoreDownloadButton className="download-card-button" />
          </aside>
        </section>
      </main>

      <footer className="site-footer">
        <span>Spark: Find Your Crew</span>
        <span>Built for the 2026 NYC intern cohort.</span>
      </footer>
    </>
  );
}
