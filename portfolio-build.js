/* Portfolio build intro: canvas-only visual layer, no changes to existing page components. */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  try {
    if (sessionStorage.getItem("edwin-portfolio-build-seen") === "1") return;
    sessionStorage.setItem("edwin-portfolio-build-seen", "1");
  } catch (_) {}

  const root = document.createElement("div");
  root.id = "portfolio-build-intro";
  root.setAttribute("role", "region");
  root.setAttribute("aria-label", "Portfolio build animation");
  root.innerHTML = `
    <canvas aria-hidden="true"></canvas>
    <div class="pb-copy">
      <p class="pb-eyebrow">EDWIN SAM K REJU / PORTFOLIO INITIALIZING</p>
      <h2 class="pb-heading">A portfolio, built in front of you.</h2>
      <p class="pb-subtitle"><span></span><i class="pb-caret" aria-hidden="true"></i></p>
    </div>
    <p class="pb-status" aria-hidden="true">18 CURSORS &nbsp;·&nbsp; 1 DESIGN SYSTEM &nbsp;·&nbsp; 760 PARTICLES</p>
    <button class="pb-skip" type="button">Skip animation <span aria-hidden="true">↗</span></button>
  `;
  document.body.appendChild(root);

  const canvas = root.querySelector("canvas");
  const ctx = canvas.getContext("2d", { alpha: true });
  const typed = root.querySelector(".pb-subtitle span");
  const skip = root.querySelector(".pb-skip");
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  const message = "18 cursors map the interface, select the accent, and shape 760 points into FOLLOW.";
  let width = 0, height = 0, dpr = 1, frame = 0, start = performance.now();
  let particles = [];
  let targets = [];
  let stopped = false;
  let lastTyped = -1;

  const cursorRoutes = [
    [[.08,.42],[.22,.34],[.38,.42],[.52,.28]],
    [[.90,.40],[.78,.32],[.64,.42],[.52,.28]],
    [[.12,.72],[.28,.66],[.40,.76],[.52,.64]],
    [[.88,.72],[.72,.66],[.60,.76],[.52,.64]],
    [[.30,.20],[.40,.30],[.48,.22],[.52,.28]],
    [[.70,.20],[.60,.30],[.54,.22],[.52,.28]]
  ];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.35);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeTargets();
  }

  function makeTargets() {
    const off = document.createElement("canvas");
    off.width = Math.max(1, Math.floor(width));
    off.height = Math.max(1, Math.floor(height));
    const o = off.getContext("2d", { willReadFrequently: true });
    const fontSize = Math.max(46, Math.min(width * .17, height * .19, 150));
    o.clearRect(0, 0, off.width, off.height);
    o.font = "800 " + fontSize + "px Inter, Arial, sans-serif";
    o.textAlign = "center";
    o.textBaseline = "middle";
    o.fillStyle = "#fff";
    o.fillText("FOLLOW", width / 2, height * .69, width * .88);
    const data = o.getImageData(0, 0, off.width, off.height).data;
    const candidates = [];
    const step = width < 600 ? 4 : 3;
    for (let y = Math.floor(height * .54); y < Math.floor(height * .82); y += step) {
      for (let x = 0; x < width; x += step) {
        if (data[(y * off.width + x) * 4 + 3] > 90) candidates.push({ x, y });
      }
    }
    targets = [];
    for (let i = 0; i < 760; i++) {
      const index = Math.floor(i * candidates.length / 760);
      const point = candidates[Math.min(index, candidates.length - 1)] || {
        x: width / 2 + (Math.random() - .5) * width * .6,
        y: height * .69 + (Math.random() - .5) * 40
      };
      targets.push({ x: point.x, y: point.y });
    }
    if (particles.length !== 760) {
      particles = targets.map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * 2,
        vy: (Math.random() - .5) * 2
      }));
    }
  }

  function drawCursor(x, y, index, alpha) {
    const colors = ["#60a5fa", "#a78bfa", "#38bdf8"];
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate((index % 3 - 1) * .08);
    ctx.fillStyle = colors[index % colors.length];
    ctx.strokeStyle = "rgba(7,12,22,.9)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 20);
    ctx.lineTo(5, 15);
    ctx.lineTo(10, 24);
    ctx.lineTo(14, 22);
    ctx.lineTo(9, 13);
    ctx.lineTo(17, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawWireframes(progress) {
    const panels = [
      [.055,.34,.30,.22], [.645,.34,.30,.22],
      [.055,.62,.40,.14], [.545,.62,.40,.14],
      [.36,.25,.28,.48]
    ];
    ctx.save();
    ctx.lineWidth = 1;
    panels.forEach((p, i) => {
      const reveal = Math.max(0, Math.min(1, (progress - i * .12) * 1.8));
      if (!reveal) return;
      const x = p[0] * width, y = p[1] * height;
      const w = p[2] * width * reveal, h = p[3] * height;
      ctx.strokeStyle = "rgba(96,165,250," + (.24 * reveal) + ")";
      ctx.setLineDash([5, 7]);
      ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(96,165,250," + (.22 * reveal) + ")";
      for (let k = 0; k < 3; k++) {
        ctx.fillRect(x + 14, y + 15 + k * 12, Math.max(12, w * (.34 - k * .06)), 2);
      }
      ctx.fillStyle = "rgba(167,139,250," + (.14 * reveal) + ")";
      ctx.fillRect(x + 14, y + h - 17, Math.max(12, w * .22), 3);
    });
    ctx.restore();
  }

  function drawSwatch(progress) {
    if (progress < 0) return;
    const x = width * .5, y = height * .49;
    ctx.save();
    ctx.globalAlpha = Math.min(1, progress * 2);
    ctx.strokeStyle = "rgba(96,165,250,.8)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, y, 19, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function animate(now) {
    if (stopped) return;
    const elapsed = (now - start) / 1000;
    const introProgress = Math.min(1, elapsed / 4.4);
    ctx.clearRect(0, 0, width, height);

    drawWireframes(introProgress);
    drawSwatch(elapsed - 3.4);

    const cursorAlpha = elapsed < 4.8 ? 1 : Math.max(0, 1 - (elapsed - 4.8) * 1.5);
    for (let i = 0; i < 18; i++) {
      const route = cursorRoutes[i % cursorRoutes.length];
      const phase = (elapsed * .42 + i * .071) % 1;
      const segment = phase * (route.length - 1);
      const idx = Math.floor(segment);
      const mix = segment - idx;
      const a = route[idx], b = route[Math.min(idx + 1, route.length - 1)];
      const x = (a[0] + (b[0] - a[0]) * mix) * width;
      const y = (a[1] + (b[1] - a[1]) * mix) * height;
      drawCursor(x, y, i, cursorAlpha);
    }

    const form = Math.max(0, Math.min(1, (elapsed - 4.65) / 1.8));
    if (form > 0) {
      const ease = 1 - Math.pow(1 - form, 3);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i], target = targets[i];
        p.x += (target.x - p.x) * (.035 + ease * .14);
        p.y += (target.y - p.y) * (.035 + ease * .14);
        const shimmer = .65 + .35 * Math.sin(elapsed * 4 + i * .09);
        ctx.fillStyle = "rgba(147,197,253," + (.25 + .75 * ease) * shimmer + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, width < 600 ? 1.05 : 1.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (elapsed > 1.45) {
      const count = Math.min(message.length, Math.floor((elapsed - 1.45) * 31));
      if (count !== lastTyped) {
        typed.textContent = message.slice(0, count);
        lastTyped = count;
      }
    }

    if (elapsed > 7.6) {
      finish();
      return;
    }
    frame = requestAnimationFrame(animate);
  }

  function finish() {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(frame);
    root.classList.add("pb-leaving");
    document.body.style.overflow = previousOverflow;
    window.setTimeout(() => root.remove(), 750);
  }

  skip.addEventListener("click", finish);
  window.addEventListener("resize", resize, { passive: true });
  resize();
  frame = requestAnimationFrame(animate);
})();
