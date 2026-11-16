/* Independent cursor-led construction experience for Edwin's existing portfolio.
   Inspired by collaborative design tools: real DOM sections are revealed in place. */
(() => {
  "use strict";

  if (!document.body || !document.querySelector("#about")) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const ease = value => value < .5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;

  const specs = [
    { id: "navigation", label: "Building the navigation", selectors: ["#navbar a", "#navbar button"] },
    { id: "about", label: "Constructing the introduction", selectors: ["#about h1", "#about h2", "#about p", "#about .pt-8 a"] },
    { id: "projects", label: "Assembling project cards", selectors: ["#projects h2", "#projects article"] },
    { id: "certifications", label: "Arranging credentials", selectors: ["#certifications h2", "#certifications article"] },
    { id: "book", label: "Composing the author section", selectors: ["#book h2", "#book p", "#book a"] },
    { id: "contact", label: "Finishing contact and social links", selectors: ["#contact h2", "#contact p", "#contact > div > a", "#contact .grid a"] }
  ];

  const root = document.createElement("div");
  root.id = "portfolio-build-intro";
  root.innerHTML = [
    '<div class="pb-boot" role="dialog" aria-modal="true" aria-label="Portfolio build animation">',
      '<div class="pb-boot-mark">ES<span>.</span></div>',
      '<p class="pb-boot-kicker">EDWIN SAM K REJU · PORTFOLIO</p>',
      '<h2>18 cursors. One portfolio.</h2>',
      '<p class="pb-boot-copy">Watch a team of AI design agents assemble this page, section by section.</p>',
      '<button class="pb-start" type="button">Start building <span>SPACE ↗</span></button>',
      '<p class="pb-boot-note">You can pause, change speed, or skip at any time.</p>',
    '</div>',
    '<div class="pb-pointer-layer" aria-hidden="true"></div>',
    '<div class="pb-hud" aria-label="Build controls">',
      '<div class="pb-hud-brand"><i></i><span>EDWIN / BUILD SESSION</span></div>',
      '<span class="pb-progress-label">READY · 00%</span>',
      '<div class="pb-progress"><i></i></div>',
      '<span class="pb-status">Waiting for start</span>',
      '<button class="pb-control pb-play" type="button" aria-label="Start or pause">▶</button>',
      '<button class="pb-control pb-auto is-on" type="button" aria-label="Toggle auto-scroll">AUTO</button>',
      '<button class="pb-control pb-speed" type="button" aria-label="Change animation speed">1×</button>',
      '<button class="pb-control pb-replay" type="button" aria-label="Replay animation">↻</button>',
      '<button class="pb-control pb-skip" type="button">SKIP</button>',
    '</div>'
  ].join("");
  document.body.appendChild(root);

  const pointerLayer = $(".pb-pointer-layer", root);
  const boot = $(".pb-boot", root);
  const startButton = $(".pb-start", root);
  const hud = $(".pb-hud", root);
  const progressLabel = $(".pb-progress-label", root);
  const progressBar = $(".pb-progress i", root);
  const statusLabel = $(".pb-status", root);
  const playButton = $(".pb-play", root);
  const autoButton = $(".pb-auto", root);
  const speedButton = $(".pb-speed", root);
  const replayButton = $(".pb-replay", root);
  const skipButton = $(".pb-skip", root);

  const accent = getComputedStyle(document.documentElement).getPropertyValue("--portfolio-accent").trim() || "#60a5fa";
  const colors = [accent, "#a78bfa", "#38bdf8", "#c084fc", "#93c5fd", "#818cf8"];
  const roles = ["LAYOUT", "TYPE", "COLOR", "COPY", "MOTION", "PIXELS"];
  const agents = [];
  let started = false;
  let paused = false;
  let stopped = false;
  let autoScroll = true;
  let speed = 1;
  let cursorIndex = 0;
  let builtCount = 0;
  let allTargets = [];
  let activeWires = [];
  let manualUntil = 0;
  let finaleCanvas = null;
  let finaleContext = null;
  let finalePoints = [];
  let finaleFrame = 0;

  function updateHud(message) {
    const percent = allTargets.length
      ? Math.round(builtCount / (allTargets.length + 1) * 100)
      : 0;
    progressLabel.textContent = (builtCount >= allTargets.length ? "FINISHING" : "BUILDING") + " · " + String(Math.min(99, percent)).padStart(2, "0") + "%";
    progressBar.style.width = Math.min(99, percent) + "%";
    if (message) statusLabel.textContent = message;
  }

  function createAgent(index) {
    const element = document.createElement("div");
    element.className = "pb-agent";
    element.style.setProperty("--agent-color", colors[index % colors.length]);
    element.innerHTML = [
      '<svg class="pb-arrow" viewBox="0 0 18 24" aria-hidden="true"><path d="M2 1v19l5-5 3.5 7 3-1.5-3.5-7H17z"/></svg>',
      '<svg class="pb-ibeam" viewBox="0 0 18 18" aria-hidden="true"><path d="M5 2h8M9 2v14M5 16h8"/></svg>',
      '<span class="pb-agent-tag"></span>',
      '<i class="pb-click-ring"></i>'
    ].join("");
    $(".pb-agent-tag", element).textContent = roles[index % roles.length];
    pointerLayer.appendChild(element);
    return {
      element,
      x: innerWidth / 2 + (Math.random() - .5) * 120,
      y: innerHeight / 2 + (Math.random() - .5) * 90
    };
  }

  for (let index = 0; index < 18; index++) agents.push(createAgent(index));

  function prepareText(element) {
    if (element.dataset.pbTextPrepared) return;
    element.dataset.pbTextPrepared = "1";
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement && node.parentElement.closest("svg,script,style,noscript")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      Array.from(node.nodeValue).forEach(character => {
        const span = document.createElement("span");
        span.className = "pb-char";
        span.textContent = character;
        fragment.appendChild(span);
      });
      node.parentNode.replaceChild(fragment, node);
    });
  }

  function collectTargets() {
    const targets = [];
    const seen = new Set();
    specs.forEach(group => {
      group.selectors.forEach(selector => {
        $$(selector).forEach(element => {
          if (seen.has(element)) return;
          const rect = element.getBoundingClientRect();
          if (!rect.width || !rect.height || getComputedStyle(element).display === "none") return;
          seen.add(element);
          element.classList.add("pb-pending");
          prepareText(element);
          targets.push({ element, group: group.id, label: group.label });
        });
      });
    });
    allTargets = targets;
    return targets;
  }

  function frameBox(element) {
    const rect = element.getBoundingClientRect();
    return {
      left: clamp(rect.left, 4, innerWidth - 4),
      top: clamp(rect.top, 4, innerHeight - 4),
      width: Math.max(14, Math.min(rect.width, innerWidth - Math.max(4, rect.left))),
      height: Math.max(14, Math.min(rect.height, innerHeight - Math.max(4, rect.top)))
    };
  }

  function createWire(rect, label) {
    const wire = document.createElement("div");
    wire.className = "pb-wire";
    wire.innerHTML = '<span class="pb-wire-label"></span><i></i><i></i><i></i><i></i>';
    $(".pb-wire-label", wire).textContent = label;
    wire.style.left = rect.left + "px";
    wire.style.top = rect.top + "px";
    wire.style.width = rect.width + "px";
    wire.style.height = rect.height + "px";
    pointerLayer.appendChild(wire);
    activeWires.push(wire);
    requestAnimationFrame(() => wire.classList.add("pb-wire-on"));
    return wire;
  }

  function moveAgent(agent, x, y, duration) {
    const startX = agent.x;
    const startY = agent.y;
    const dx = x - startX;
    const dy = y - startY;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const bend = Math.min(80, distance * .18) * (Math.random() < .5 ? -1 : 1);
    const cx = (startX + x) / 2 - dy / distance * bend;
    const cy = (startY + y) / 2 + dx / distance * bend;
    return animateTime(duration, progress => {
      const inverse = 1 - progress;
      agent.x = inverse * inverse * startX + 2 * inverse * progress * cx + progress * progress * x;
      agent.y = inverse * inverse * startY + 2 * inverse * progress * cy + progress * progress * y;
      agent.element.style.transform = "translate3d(" + agent.x + "px," + agent.y + "px,0)";
    });
  }

  function animateTime(duration, callback) {
    return new Promise(resolve => {
      let elapsed = 0;
      let last = performance.now();
      function tick(now) {
        if (stopped) return resolve();
        const delta = now - last;
        last = now;
        if (!paused) elapsed += delta * speed;
        const progress = clamp(elapsed / duration, 0, 1);
        callback(ease(progress), progress);
        if (progress < 1) requestAnimationFrame(tick);
        else resolve();
      }
      requestAnimationFrame(tick);
    });
  }

  const wait = duration => animateTime(duration, () => {});

  function scrollToY(destination, duration) {
    if (!autoScroll || Date.now() < manualUntil) return Promise.resolve();
    const from = window.scrollY;
    const to = Math.max(0, destination);
    if (Math.abs(to - from) < 8) return Promise.resolve();
    return animateTime(duration, progress => {
      if (autoScroll && Date.now() >= manualUntil) window.scrollTo(0, from + (to - from) * progress);
    });
  }

  async function bringIntoView(element) {
    if (!autoScroll || Date.now() < manualUntil) return;
    const rect = element.getBoundingClientRect();
    const topSafe = 100;
    const bottomSafe = innerHeight - 135;
    if (rect.top >= topSafe && rect.bottom <= bottomSafe) return;
    const absoluteTop = window.scrollY + rect.top;
    const destination = Math.max(0, absoluteTop - 125);
    const distance = Math.abs(destination - window.scrollY);
    await scrollToY(destination, clamp(distance * .65, 500, 1600));
  }

  function pulseElement(element) {
    if (!element.animate) return;
    try {
      element.animate([
        { transform: "translate3d(0,12px,0) scale(.965)", filter: "blur(1.5px)" },
        { transform: "translate3d(0,-2px,0) scale(1.012)", filter: "blur(0)" },
        { transform: "translate3d(0,0,0) scale(1)", filter: "none" }
      ], { duration: 680 / speed, easing: "cubic-bezier(.2,.8,.2,1)" });
    } catch (_) {}
  }

  async function revealChars(element) {
    const characters = $$(".pb-char", element);
    if (!characters.length) {
      await wait(160);
      return;
    }
    const batch = Math.max(3, Math.ceil(characters.length / 32));
    for (let index = 0; index < characters.length; index += batch) {
      if (stopped) return;
      while (paused && !stopped) await new Promise(resolve => setTimeout(resolve, 80));
      characters.slice(index, index + batch).forEach(character => character.classList.add("pb-char-on"));
      await wait(28);
    }
  }

  async function buildTarget(item, index) {
    const element = item.element;
    if (!element.isConnected || !element.classList.contains("pb-pending")) return;
    await bringIntoView(element);
    if (stopped) return;

    const rect = frameBox(element);
    const label = element.tagName.toLowerCase() + " · " + Math.round(rect.width) + " × " + Math.round(rect.height);
    const wire = createWire(rect, label);
    const points = agents.map((agent, agentIndex) => {
      const angle = (Math.PI * 2 * agentIndex / agents.length) + index * .13;
      const radiusX = Math.max(8, rect.width * (.24 + (agentIndex % 3) * .08));
      const radiusY = Math.max(8, rect.height * (.22 + (agentIndex % 4) * .07));
      return {
        x: clamp(rect.left + rect.width / 2 + Math.cos(angle) * radiusX, 2, innerWidth - 20),
        y: clamp(rect.top + rect.height / 2 + Math.sin(angle) * radiusY, 2, innerHeight - 26)
      };
    });

    await Promise.all(agents.map((agent, agentIndex) =>
      moveAgent(agent, points[agentIndex].x, points[agentIndex].y, 420 + (agentIndex % 4) * 85)
    ));
    if (stopped) return;

    agents.forEach(agent => {
      agent.element.classList.add("pb-clicking");
    });
    await wait(170);
    agents.forEach(agent => agent.element.classList.remove("pb-clicking"));

    const current = frameBox(element);
    const edgeMoves = agents.map((agent, agentIndex) => {
      const corner = agentIndex % 4;
      const x = corner % 2 ? current.left + current.width - 6 : current.left + 6;
      const y = corner > 1 ? current.top + current.height - 6 : current.top + 6;
      if (agentIndex % 3 === 1) agent.element.classList.add("pb-typing");
      return moveAgent(agent, clamp(x, 2, innerWidth - 20), clamp(y, 2, innerHeight - 26), 340 + (agentIndex % 5) * 65);
    });
    await Promise.all(edgeMoves);
    if (stopped) return;

    element.classList.remove("pb-pending");
    element.classList.add("pb-built");
    pulseElement(element);
    await revealChars(element);

    // A final resize pass: the handles stretch outward and settle back onto the real element.
    wire.classList.add("pb-wire-resize");
    await wait(240);
    wire.classList.remove("pb-wire-on", "pb-wire-resize");
    agents.forEach(agent => agent.element.classList.remove("pb-typing"));
    window.setTimeout(() => wire.remove(), 450);
    builtCount++;
    updateHud("Built " + builtCount + " of " + allTargets.length + " components");
  }

  function ensureFinale() {
    if (finaleCanvas) return;
    const contact = $("#contact");
    const socialGrid = $(".grid", contact);
    const container = document.createElement("div");
    container.className = "pb-finale";
    container.innerHTML = '<p>THE PAGE IS BUILT · NOW IT’S YOUR TURN</p><canvas aria-label="FOLLOW particle animation"></canvas><strong>FOLLOW</strong>';
    if (socialGrid) socialGrid.insertAdjacentElement("afterend", container);
    else contact.appendChild(container);
    finaleCanvas = $("canvas", container);
    finaleContext = finaleCanvas.getContext("2d");
  }

  function finaleTargets() {
    const canvas = finaleCanvas;
    const container = canvas.parentElement;
    const width = Math.max(240, Math.floor(container.clientWidth));
    const height = 190;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    const offscreen = document.createElement("canvas");
    offscreen.width = width;
    offscreen.height = height;
    const context = offscreen.getContext("2d", { willReadFrequently: true });
    context.font = "900 " + Math.min(112, width * .19) + "px Inter, Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#ffffff";
    context.fillText("FOLLOW", width / 2, height / 2, width * .94);
    const pixels = context.getImageData(0, 0, width, height).data;
    const points = [];
    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        if (pixels[(y * width + x) * 4 + 3] > 100) points.push({ x, y });
      }
    }
    finalePoints = Array.from({ length: 760 }, (_, index) => {
      const target = points[Math.floor(index * points.length / 760)] || { x: width / 2, y: height / 2 };
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        tx: target.x,
        ty: target.y
      };
    });
    return { width, height, dpr };
  }

  async function runFinale() {
    ensureFinale();
    const contact = $("#contact");
    const top = window.scrollY + contact.getBoundingClientRect().top - 80;
    await scrollToY(top, 1300);
    const size = finaleTargets();
    const container = finaleCanvas.parentElement;
    container.classList.add("pb-finale-active");
    updateHud("Assembling the final FOLLOW mark");
    await animateTime(5200, (progress, raw) => {
      finaleContext.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
      finaleContext.clearRect(0, 0, size.width, size.height);
      finalePoints.forEach((point, index) => {
        const drift = (1 - raw) * Math.sin(performance.now() * .0015 + index) * 28;
        const x = point.x + (point.tx - point.x) * progress + drift;
        const y = point.y + (point.ty - point.y) * progress + drift * .28;
        finaleContext.fillStyle = "rgba(147,197,253," + (.28 + .72 * progress) + ")";
        finaleContext.beginPath();
        finaleContext.arc(x, y, 1.35, 0, Math.PI * 2);
        finaleContext.fill();
      });
    });
    // Settle all 760 points precisely before the interface controls disappear.
    finaleContext.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
    finaleContext.clearRect(0, 0, size.width, size.height);
    finalePoints.forEach(point => {
      finaleContext.fillStyle = "#93c5fd";
      finaleContext.beginPath();
      finaleContext.arc(point.tx, point.ty, 1.35, 0, Math.PI * 2);
      finaleContext.fill();
    });
  }

  function setSpeed(nextSpeed) {
    speed = nextSpeed;
    speedButton.textContent = speed + "×";
  }

  async function runBuild() {
    collectTargets();
    builtCount = 0;
    updateHud("Preparing the page structure");
    let index = 0;

    for (const group of specs) {
      if (stopped) return;
      const section = group.id === "navigation" ? $("#navbar") : $("#" + group.id);
      if (section && group.id !== "navigation") {
        const targetY = window.scrollY + section.getBoundingClientRect().top - 78;
        await scrollToY(targetY, clamp(Math.abs(targetY - window.scrollY) * .7, 700, 1700));
      }
      updateHud(group.label);
      const elements = allTargets.filter(item => item.group === group.id);
      for (const item of elements) {
        if (stopped) return;
        await buildTarget(item, index++);
        await wait(120);
      }
    }

    if (stopped) return;
    await runFinale();
    if (stopped) return;
    progressLabel.textContent = "COMPLETE · 100%";
    progressBar.style.width = "100%";
    statusLabel.textContent = "Website assembled · enjoy exploring";
    agents.forEach(agent => agent.element.classList.add("pb-agent-done"));
    hud.classList.add("pb-hud-out");
    document.documentElement.classList.remove("pb-building");
    window.setTimeout(() => root.remove(), 900);
  }

  function startBuild() {
    if (started) return;
    started = true;
    boot.classList.add("pb-boot-out");
    hud.classList.add("pb-hud-visible");
    document.documentElement.classList.add("pb-building");
    window.scrollTo(0, 0);
    playButton.textContent = "Ⅱ";
    playButton.setAttribute("aria-label", "Pause build");
    runBuild().catch(error => {
      console.error("Portfolio build animation:", error);
      revealEverything();
    });
  }

  function revealEverything() {
    stopped = true;
    $$(".pb-pending").forEach(element => {
      element.classList.remove("pb-pending");
      element.classList.add("pb-built");
    });
    $$(".pb-char").forEach(character => character.classList.add("pb-char-on"));
    activeWires.forEach(wire => wire.remove());
    agents.forEach(agent => agent.element.remove());
    ensureFinale();
    const size = finaleTargets();
    finaleContext.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
    finaleContext.font = "900 " + Math.min(112, size.width * .19) + "px Inter, Arial, sans-serif";
    finaleContext.textAlign = "center";
    finaleContext.textBaseline = "middle";
    finaleContext.fillStyle = "#93c5fd";
    finaleContext.fillText("FOLLOW", size.width / 2, size.height / 2, size.width * .94);
    document.documentElement.classList.remove("pb-building");
    root.remove();
  }

  function replay() {
    window.location.reload();
  }

  startButton.addEventListener("click", startBuild);
  playButton.addEventListener("click", () => {
    if (!started) return startBuild();
    paused = !paused;
    playButton.textContent = paused ? "▶" : "Ⅱ";
    playButton.setAttribute("aria-label", paused ? "Resume build" : "Pause build");
    statusLabel.textContent = paused ? "Paused · press Space to resume" : "Build resumed";
  });
  autoButton.addEventListener("click", () => {
    autoScroll = !autoScroll;
    autoButton.classList.toggle("is-on", autoScroll);
    autoButton.textContent = autoScroll ? "AUTO" : "MANUAL";
  });
  speedButton.addEventListener("click", () => {
    setSpeed(speed === .75 ? 1 : speed === 1 ? 1.5 : speed === 1.5 ? 2 : .75);
  });
  replayButton.addEventListener("click", replay);
  skipButton.addEventListener("click", revealEverything);

  root.addEventListener("click", event => {
    if (!started && event.target === boot) startBuild();
  });
  window.addEventListener("wheel", () => { manualUntil = Date.now() + 2200; }, { passive: true });
  window.addEventListener("touchmove", () => { manualUntil = Date.now() + 2200; }, { passive: true });
  window.addEventListener("keydown", event => {
    if (event.target && /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    if (event.code === "Space") {
      event.preventDefault();
      if (!started) startBuild();
      else if (!stopped) playButton.click();
    } else if (event.key.toLowerCase() === "a" && started) {
      autoButton.click();
    } else if (event.key.toLowerCase() === "r" && started) {
      replay();
    }
  });

  // Keep the footer word crisp if the visitor changes device orientation mid-build.
  window.addEventListener("resize", () => {
    if (finaleCanvas && !stopped) finaleTargets();
  }, { passive: true });
})();
