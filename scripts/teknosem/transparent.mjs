// White-background removal shared by build-content.mjs (site WebP) and export-transparent-png.mjs (archive PNG).

/**
 * Makes the white studio background of a render transparent.
 * Flood fill from the image border through near-white, low-saturation pixels, so white parts *inside* the product
 * (panels, labels) are kept because they are not connected to the border. Pixels in the fill get an alpha ramp
 * (pure white → transparent, light grey shadows → partly transparent) and the white is removed from their colour,
 * then a 1px band around the fill is de-haloed the same way so anti-aliased edges do not glow on dark pages.
 */
const FILL_MIN = 226; // min(r,g,b) for a pixel to belong to the background
const CLEAR_MIN = 248; // at or above this, the background pixel is fully transparent
const MAX_SPREAD = 22; // max(r,g,b) - min(r,g,b): keeps coloured light areas (e.g. yellow) out of the fill

export function removeWhiteBackground(data, width, height) {
  const n = width * height;
  const state = new Uint8Array(n); // 0 = untouched, 1 = background
  const isBackground = (p) => {
    const i = p * 4;
    if (data[i + 3] < 16) return true;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lo = Math.min(r, g, b);
    return lo >= FILL_MIN && Math.max(r, g, b) - lo <= MAX_SPREAD;
  };
  const stack = [];
  const seed = (p) => {
    if (!state[p] && isBackground(p)) {
      state[p] = 1;
      stack.push(p);
    }
  };
  const flood = () => {
    while (stack.length) {
      const p = stack.pop();
      const x = p % width;
      if (x > 0) seed(p - 1);
      if (x < width - 1) seed(p + 1);
      if (p >= width) seed(p - width);
      if (p < n - width) seed(p + width);
    }
  };
  for (let x = 0; x < width; x++) { seed(x); seed((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { seed(y * width); seed(y * width + width - 1); }
  flood();

  // Background seen through enclosed gaps (e.g. inside a cable-chain loop) is not connected to the border.
  // Such pockets are removed when they are pure studio white (product surfaces are shaded, never 250+ flat)
  // and large enough not to be a highlight.
  const isPureWhite = (p) => {
    const i = p * 4;
    return Math.min(data[i], data[i + 1], data[i + 2]) >= 250 && Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2]) <= 6;
  };
  const visited = new Uint8Array(n);
  const minPocket = Math.max(400, Math.round(n * 0.002));
  for (let start = 0; start < n; start++) {
    if (state[start] || visited[start] || !isPureWhite(start)) continue;
    const component = [start];
    visited[start] = 1;
    for (let k = 0; k < component.length; k++) {
      const p = component[k];
      const x = p % width;
      for (const q of [x > 0 ? p - 1 : -1, x < width - 1 ? p + 1 : -1, p - width, p + width]) {
        if (q >= 0 && q < n && !visited[q] && !state[q] && isPureWhite(q)) {
          visited[q] = 1;
          component.push(q);
        }
      }
    }
    if (component.length >= minPocket) {
      for (const p of component) {
        state[p] = 1;
        stack.push(p);
      }
      flood(); // extend into the pocket's light, anti-aliased rim
    }
  }
  let cleared = 0;
  const unwhite = (p, strength) => {
    const i = p * 4;
    const lo = Math.min(data[i], data[i + 1], data[i + 2]);
    // How much of this pixel is the white background (0..1).
    const w = Math.max(0, Math.min(1, (lo - FILL_MIN) / (CLEAR_MIN - FILL_MIN))) * strength;
    const alpha = 1 - w;
    if (alpha <= 0.02) {
      data[i + 3] = 0;
      return;
    }
    for (let c = 0; c < 3; c++) data[i + c] = Math.max(0, Math.min(255, Math.round((data[i + c] - 255 * w) / alpha)));
    data[i + 3] = Math.round(data[i + 3] * alpha);
  };
  for (let p = 0; p < n; p++) {
    if (state[p] === 1) {
      unwhite(p, 1);
      cleared++;
    }
  }
  // De-halo: untouched pixels next to the fill are often a white/colour blend.
  for (let p = 0; p < n; p++) {
    if (state[p]) continue;
    const x = p % width;
    if ((x > 0 && state[p - 1] === 1) || (x < width - 1 && state[p + 1] === 1) || (p >= width && state[p - width] === 1) || (p < n - width && state[p + width] === 1)) {
      const i = p * 4;
      if (Math.min(data[i], data[i + 1], data[i + 2]) > 200) unwhite(p, 0.85);
    }
  }
  return cleared / n;
}
