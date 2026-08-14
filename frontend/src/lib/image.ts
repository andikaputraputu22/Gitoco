/**
 * Loads the developer avatar into a rounded PNG data URL so jsPDF can embed it.
 *
 * jsPDF draws synchronously and can't fetch, so the caller awaits this first and
 * hands the result to `generatePortfolioPdf`. Rounding is baked into the bitmap
 * (jsPDF has no rounded-image clip), which matches the preview's rounded avatar.
 * Any failure — CORS, offline, slow host — resolves to null and the PDF simply
 * renders without the photo.
 */
export function loadRoundedImage(
  url: string,
  size = 176,
  radius = 30,
  timeoutMs = 4000,
): Promise<string | null> {
  return new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    let settled = false;

    const finish = (value: string | null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve(value);
    };

    const timer = window.setTimeout(() => finish(null), timeoutMs);

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return finish(null);

        // rounded-square clip
        const r = Math.min(radius, size / 2);
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(size - r, 0);
        ctx.quadraticCurveTo(size, 0, size, r);
        ctx.lineTo(size, size - r);
        ctx.quadraticCurveTo(size, size, size - r, size);
        ctx.lineTo(r, size);
        ctx.quadraticCurveTo(0, size, 0, size - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
        ctx.clip();

        // cover-crop, like object-cover in the preview
        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

        finish(canvas.toDataURL("image/png"));
      } catch {
        finish(null);
      }
    };

    img.onerror = () => finish(null);
    img.src = url;
  });
}
