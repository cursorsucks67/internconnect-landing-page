import { mkdir, writeFile } from "node:fs/promises";

const outputDir = new URL("../public/map-overlays/company-pins/", import.meta.url);

const pins = [
  { slug: "jpmorgan", label: "JPMorgan", count: "31", fill: "#d6c45d", ink: "#071422" },
  { slug: "goldman", label: "Goldman", count: "22", fill: "#2d99d4", ink: "#071422" },
  { slug: "morgan-stanley", label: "Morgan Stanley", count: "16", fill: "#e95b4f", ink: "#071422" },
  { slug: "citi", label: "Citi", count: "14", fill: "#9b6bb8", ink: "#071422" },
  { slug: "google", label: "Google", count: "18", fill: "#d6c45d", ink: "#071422" },
  { slug: "meta", label: "Meta", count: "11", fill: "#2ec4a6", ink: "#071422" },
  { slug: "mckinsey", label: "McKinsey", count: "13", fill: "#f8f4eb", ink: "#071422" },
  { slug: "bofa", label: "BofA", count: "15", fill: "#2d99d4", ink: "#071422" },
];

const paper = "#f8f4eb";
const shadow = "#07142233";

const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const labelWidth = (label) => Math.max(76, Math.min(154, 30 + label.length * 8.4));

const pinSvg = ({ label, count, fill, ink }) => {
  const width = labelWidth(label);
  const labelX = 70;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width + 94}" height="116" viewBox="0 0 ${width + 94} 116" role="img" aria-label="${escapeXml(label)} map pin">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="7" stdDeviation="5" flood-color="${shadow}"/>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <circle cx="40" cy="49" r="33" fill="${fill}" stroke="${paper}" stroke-width="8"/>
    <circle cx="40" cy="49" r="37" fill="none" stroke="${ink}" stroke-width="2"/>
    <path d="M40 103 28 74h24L40 103Z" fill="${fill}" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="40" cy="49" r="9" fill="${ink}"/>
    <rect x="${labelX}" y="27" width="${width}" height="34" rx="17" fill="${ink}"/>
    <text x="${labelX + width / 2}" y="50" fill="${paper}" font-family="Trebuchet MS, Avenir Next, Arial, sans-serif" font-size="17" font-weight="900" text-anchor="middle">${escapeXml(label)}</text>
    <rect x="${labelX + 8}" y="65" width="52" height="25" rx="12.5" fill="${fill}" stroke="${ink}" stroke-width="2"/>
    <text x="${labelX + 34}" y="83" fill="${ink}" font-family="Trebuchet MS, Avenir Next, Arial, sans-serif" font-size="14" font-weight="900" text-anchor="middle">${escapeXml(count)}</text>
  </g>
</svg>
`;
};

const markerOnlySvg = ({ slug, fill, ink }) => `<svg xmlns="http://www.w3.org/2000/svg" width="88" height="112" viewBox="0 0 88 112" role="img" aria-label="${escapeXml(slug)} marker">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="7" stdDeviation="5" flood-color="${shadow}"/>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <circle cx="44" cy="43" r="33" fill="${fill}" stroke="${paper}" stroke-width="8"/>
    <circle cx="44" cy="43" r="37" fill="none" stroke="${ink}" stroke-width="2"/>
    <path d="M44 104 32 68h24L44 104Z" fill="${fill}" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="44" cy="43" r="9" fill="${ink}"/>
  </g>
</svg>
`;

const legend = `# Company Map Overlay Pins

These transparent SVG assets are designed for real map overlays such as Apple Maps / MapKit JS.

Use the full assets when you want the pin, company label, and intern count in one image:

\`/map-overlays/company-pins/jpmorgan.svg\`

Use the \`*-marker.svg\` files when the map layer should render its own labels:

\`/map-overlays/company-pins/jpmorgan-marker.svg\`

Suggested marker anchor:
- Full pin assets: bottom point at roughly \`x: 40px\`, \`y: 103px\`.
- Marker-only assets: bottom point at roughly \`x: 44px\`, \`y: 104px\`.

Apple MapKit JS example:

\`\`\`js
const coordinate = new mapkit.Coordinate(40.7558, -73.9752);
const annotation = new mapkit.ImageAnnotation(coordinate, {
  url: "/map-overlays/company-pins/jpmorgan.svg",
  anchorOffset: new DOMPoint(-40, -103),
});
map.addAnnotation(annotation);
\`\`\`
`;

await mkdir(outputDir, { recursive: true });

await Promise.all(
  pins.flatMap((pin) => [
    writeFile(new URL(`${pin.slug}.svg`, outputDir), pinSvg(pin)),
    writeFile(new URL(`${pin.slug}-marker.svg`, outputDir), markerOnlySvg(pin)),
  ]),
);

await writeFile(new URL("README.md", outputDir), legend);
