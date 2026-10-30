# QRCode.js

JavaScript QR code generator with custom shapes, a transparent background, and SVG / PNG export. No dependencies.

**Live demo:** [https://vvishakhp.github.io/qr-code/](https://vvishakhp.github.io/qr-code/)

Based on [davidshimjs/qrcodejs](https://github.com/davidshimjs/qrcodejs).

## Basic usage

```html
<div id="qrcode"></div>
<script src="qrcode.js"></script>
<script>
new QRCode(document.getElementById("qrcode"), "https://example.com");
</script>
```

or with options:

```javascript
var qrcode = new QRCode(document.getElementById("qrcode"), {
  text: "https://example.com",
  width: 256,
  height: 256,
  colorDark: "#000000",
  colorLight: "#ffffff",
  transparent: false,
  correctLevel: QRCode.CorrectLevel.H,
  moduleShape: "rounded",
  markerShape: "circle",
  markerInnerShape: "circle",
  alignmentShape: "circle"
});
```

## Shape options

| Option | Values | Default |
| --- | --- | --- |
| `moduleShape` | `square`, `rounded`, `extra-rounded`, `dots`, `diamond` | `square` |
| `markerShape` | `square`, `rounded`, `extra-rounded`, `circle`, `leaf` | `square` |
| `markerInnerShape` | `square`, `rounded`, `extra-rounded`, `circle`, `diamond` | matches `markerShape` |
| `alignmentShape` | `square`, `rounded`, `extra-rounded`, `circle` | matches `markerShape` |

Set `transparent: true` (or `colorLight: "transparent"`) to skip the light fill. Finder and alignment holes stay cut out.

## Export

```javascript
qrcode.downloadSVG("qrcode.svg");
qrcode.downloadPNG("qrcode.png", 2048); // 1024, 2048, 4096, ...

var svg = qrcode.getSVG();
var pngDataUrl = qrcode.getDataURL(2048);
```

SVG is vector and stays sharp at any size. PNG keeps the alpha channel when the background is transparent.

## Other methods

```javascript
qrcode.clear();
qrcode.makeCode("https://example.com");
```

## License

MIT License
