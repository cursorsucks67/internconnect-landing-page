# Company Map Overlay Pins

These transparent SVG assets are designed for real map overlays such as Apple Maps / MapKit JS.

Use the full assets when you want the pin, company label, and intern count in one image:

`/map-overlays/company-pins/jpmorgan.svg`

Use the `*-marker.svg` files when the map layer should render its own labels:

`/map-overlays/company-pins/jpmorgan-marker.svg`

Suggested marker anchor:
- Full pin assets: bottom point at roughly `x: 40px`, `y: 103px`.
- Marker-only assets: bottom point at roughly `x: 44px`, `y: 104px`.

Apple MapKit JS example:

```js
const coordinate = new mapkit.Coordinate(40.7558, -73.9752);
const annotation = new mapkit.ImageAnnotation(coordinate, {
  url: "/map-overlays/company-pins/jpmorgan.svg",
  anchorOffset: new DOMPoint(-40, -103),
});
map.addAnnotation(annotation);
```
