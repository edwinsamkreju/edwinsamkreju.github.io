/* Live portfolio build choreography. Visual-only DOM interaction; original content and links remain intact. */
(() => {
  "use strict";
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const params = new URLSearchParams(location.search);
  try {
    if (!params.has("build") && sessionStorage.getItem("edwin-live-build-seen") === "1") return;
    sessionStorage.setItem("edwin-live-build-seen", "1");
  } catch (_) {}

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const sections = [
    { id: "about", label: "Constructing hero layout", selectors: ["#about h1", "#about h2", "#about p", "#about a"] },
    { id: "projects", label: "Arranging project components", selectors: ["#projects h2", "#projects article", "#projects article h3", "#projects article a"] },
    { id: "certifications", label: "Aligning credentials grid", selectors: ["#certifications h2", "#certifications article", "#certifications article h3"] },
    { id: "book", label: "Composing author feature", selectors: ["#book h2", "#book p", "#book a"] },
    { id: "contact", label: "Building contact and social links", selectors: ["#contact h2", "#contact p", "#contact a"] }
  ];
  if (!sections.every(s => $("#" + s.id))) return;

  const root = document.createElement("div");
  root.id = "portfolio-build-intro";
  root.innerHTML = `
    <div class="pb-topbar">
      <div><span class="pb-live-dot"></span><b>EDWIN'S PORTFOLIO</b><small>AI BUILD SESSION</small></div>
      <span class="pb-counter">INITIALIZING · 00%</span>
      <button class="pb-skip" type="button">Skip build ↗</button>
    </div>
    <div class="pb-caption"><span class="pb-step">Preparing workspace</span><span class="pb-detail">Coordinating 18 AI agents</span></div>
    <div class="pb-pointer-layer" aria-hidden="true"></div>
  `;
  document.body.appendChild(root);

  const pointerLayer = $(".pb-pointer-layer", root);
  const counter = $(".pb-counter", root);
  const stepLabel = $(".pb-step", root);
  const detailLabel = $(".pb-detail", root);
  const skip = $(".pb-skip", root);
  const previousOverflow = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";

  const colors = ["#60a5fa","#a78bfa","#38bdf8","#c084fc","#93c5fd","#818cf8"];
  const cursors = [];
  for (let i = 0; i < 18; i++) {
    const el = document.createElement("div");
    el.className = "pb-agent";
    el.innerHTML = '<svg viewBox="0 0 24 28" aria-hidden="true"><path d="M2 2 L2 23 L8 17 L12 26 L16 24 L12 15 L21 15 Z"/></svg><span>AI-' + String(i+1).padStart(2,"0") + '</span><i></i>';
    el.style.setProperty("--agent-color", colors[i % colors.length]);
    pointerLayer.appendChild(el);
    cursors.push({ el, x: innerWidth/2, y: innerHeight/2, tx: innerWidth/2, ty: innerHeight/2, target: null, phase: i/18 });
  }

  const highlight = document.createElement("div");
  highlight.className = "pb-selection";
  pointerLayer.appendChild(highlight);
  const handles = [];
  for (let i = 0; i < 4; i++) {
    const h = document.createElement("i");
    h.className = "pb-handle";
    pointerLayer.appendChild(h);
    handles.push(h);
  }
  const guide = document.createElement("div");
  guide.className = "pb-guide";
  pointerLayer.appendChild(guide);

  const footer = $("#contact");
  const socials = $(".grid", footer);
  const followWrap = document.createElement("div");
  followWrap.className = "pb-follow-wrap";
  followWrap.innerHTML = '<div class="pb-follow-kicker">ALL SYSTEMS BUILT · READY TO CONNECT</div><canvas aria-hidden="true"></canvas><div class="pb-follow-word" aria-label="Follow">FOLLOW</div>';
  if (socials) socials.insertAdjacentElement("afterend", followWrap);
  const followCanvas = $("canvas", followWrap);
  const fctx = followCanvas.getContext("2d");

  let stopped = false, completed = false, raf = 0, start = 0, scrollStart = 0;
  const DURATION = 51; // deliberate, slow walkthrough
  const stages = sections.map((s, i) => ({...s, start: 2 + i*8.4, duration: 8.4}));
  const finalStart = 44;
  const finalDuration = 7;
  let activeTarget = null;
  let targetNodes = [];

  function scrollToSection(id, progress) {
    const el = $("#" + id);
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top - 78;
    const eased = progress < .5 ? 2*progress*progress : 1 - Math.pow(-2*progress+2,2)/2;
    window.scrollTo(0, scrollStart + (top - scrollStart) * eased);
  }

  function getTargets(stage) {
    const found = stage.selectors.flatMap(sel => $$(sel)).filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 4 && r.height > 4;
    });
    return [...new Set(found)];
  }

  function boxFor(el) {
    const r = el.getBoundingClientRect();
    return { left:r.left, top:r.top, width:r.width, height:r.height, right:r.right, bottom:r.bottom, cx:r.left+r.width/2, cy:r.top+r.height/2 };
  }

  function setSelection(el, action) {
    if (!el) return;
    activeTarget = el;
    const b = boxFor(el);
    highlight.style.display = "block";
    highlight.style.left = (b.left-7)+"px";
    highlight.style.top = (b.top-7)+"px";
    highlight.style.width = (b.width+14)+"px";
    highlight.style.height = (b.height+14)+"px";
    highlight.dataset.action = action;
    handles.forEach((h,i) => {
      h.style.display = "block";
      h.style.left = ((i%2 ? b.right : b.left)-5)+"px";
      h.style.top = ((i>1 ? b.bottom : b.top)-5)+"px";
    });
    guide.style.display = "block";
    guide.style.left = b.left+"px";
    guide.style.top = (b.bottom+9)+"px";
    guide.textContent = action;
  }

  function hideSelection() {
    highlight.style.display = "none";
    handles.forEach(h => h.style.display = "none");
    guide.style.display = "none";
    activeTarget = null;
  }

  function pointerDestination(el, index, t, action) {
    const b = boxFor(el);
    const corners = [
      [b.left+Math.min(20,b.width*.2), b.top+Math.min(20,b.height*.2)],
      [b.right-Math.min(20,b.width*.2), b.top+Math.min(20,b.height*.2)],
      [b.right-Math.min(20,b.width*.2), b.bottom-Math.min(20,b.height*.2)],
      [b.left+Math.min(20,b.width*.2), b.bottom-Math.min(20,b.height*.2)],
      [b.cx,b.cy]
    ];
    const phase = (t*0.9 + index*.37) % 1;
    let corner = Math.floor(phase*corners.length);
    const next = (corner+1)%corners.length;
    const mix = phase*corners.length-corner;
    let x = corners[corner][0] + (corners[next][0]-corners[corner][0])*mix;
    let y = corners[corner][1] + (corners[next][1]-corners[corner][1])*mix;
    if (action === "DRAGGING" && index % 3 === 0) {
      x = b.left + b.width*(.15 + .7*((t*1.4)%1));
      y = b.cy + Math.sin(t*8+index)*Math.min(14,b.height*.12);
    } else if (action === "RESIZING" && index % 3 === 1) {
      x = b.right - 5; y = b.bottom - 5;
    } else if (action === "TYPING" && index % 3 === 2) {
      x = b.left + Math.min(b.width-8, 18 + (t*42)%Math.max(24,b.width-24));
      y = b.cy;
    }
    return {x,y};
  }

  function animatePointers(nodes, t, action) {
    if (!nodes.length) return;
    cursors.forEach((c,i) => {
      const node = nodes[i % nodes.length];
      const dest = pointerDestination(node, i, t, action);
      c.x += (dest.x-c.x)*.12;
      c.y += (dest.y-c.y)*.12;
      c.el.style.transform = "translate3d("+c.x+"px,"+c.y+"px,0)";
      c.el.style.opacity = "1";
      c.el.classList.toggle("pb-clicking", Math.sin(t*9+i) > .87);
    });
  }

  function applyWorkEffect(nodes, t, action) {
    nodes.forEach((node,i) => {
      node.classList.add("pb-being-built");
      const phase = (t*1.25 + i*.19)%1;
      if (action === "RESIZING" && i%3===0) {
        node.style.setProperty("--pb-work-scale", String(1 + .018*Math.sin(t*3+i)));
      } else if (action === "DRAGGING" && i%4===0) {
        node.style.setProperty("--pb-work-shift", (Math.sin(t*2+i)*4)+"px");
      } else {
        node.style.setProperty("--pb-work-scale", String(1 + .006*Math.sin(t*2+i)));
        node.style.setProperty("--pb-work-shift", "0px");
      }
      node.style.setProperty("--pb-work-glow", String(.35 + .3*Math.sin(t*4+i)));
    });
  }

  function clearWorkEffects() {
    $$(".pb-being-built").forEach(node => {
      node.classList.remove("pb-being-built");
      node.style.removeProperty("--pb-work-scale");
      node.style.removeProperty("--pb-work-shift");
      node.style.removeProperty("--pb-work-glow");
    });
    hideSelection();
  }

  function drawFollow(progress, now) {
    const w = Math.max(1, followWrap.clientWidth);
    const h = 170;
    const dpr = Math.min(devicePixelRatio||1, 1.5);
    if (followCanvas.width !== Math.round(w*dpr) || followCanvas.height !== Math.round(h*dpr)) {
      followCanvas.width = Math.round(w*dpr);
      followCanvas.height = Math.round(h*dpr);
      followCanvas.style.width = w+"px";
      followCanvas.style.height = h+"px";
    }
    fctx.setTransform(dpr,0,0,dpr,0,0);
    fctx.clearRect(0,0,w,h);
    fctx.font = "900 "+Math.min(112,w*.19)+"px Inter,Arial,sans-serif";
    fctx.textAlign = "center"; fctx.textBaseline = "middle";
    fctx.fillStyle = "#fff";
    fctx.fillText("FOLLOW",w/2,h/2,w*.94);
    const image = fctx.getImageData(0,0,Math.round(w*dpr),Math.round(h*dpr));
    const points = [];
    const step = Math.max(3,Math.round(4*dpr));
    for(let y=0;y<image.height;y+=step) for(let x=0;x<image.width;x+=step) {
      if(image.data[(y*image.width+x)*4+3]>120) points.push({x:x/dpr,y:y/dpr});
    }
    fctx.clearRect(0,0,w,h);
    const count = Math.min(760,points.length);
    const appear = Math.min(1,progress*1.45);
    for(let i=0;i<count;i++) {
      const p=points[Math.floor(i*points.length/count)];
      const drift=(1-appear)*Math.sin(now*.0015+i)*24;
      fctx.fillStyle="rgba(147,197,253,"+(0.25+0.75*appear)+")";
      fctx.beginPath(); fctx.arc(p.x+drift,p.y+drift*.35,1.25,0,Math.PI*2); fctx.fill();
    }
    if(progress>=1) followWrap.classList.add("pb-follow-done");
  }

  function finish() {
    if(stopped) return;
    stopped=true; cancelAnimationFrame(raf);
    clearWorkEffects();
    cursors.forEach(c=>c.el.style.opacity="0");
    root.classList.add("pb-finished");
    document.documentElement.style.scrollBehavior=previousOverflow;
    try { sessionStorage.setItem("edwin-live-build-complete","1"); } catch(_){}
    window.setTimeout(()=>root.remove(),900);
  }

  function frame(now) {
    if(stopped) return;
    const elapsed=(now-start)/1000;
    const percent=Math.min(100,Math.round(elapsed/DURATION*100));
    counter.textContent="BUILDING · "+String(percent).padStart(2,"0")+"%";

    if(elapsed<2) {
      stepLabel.textContent="Initializing the workspace";
      detailLabel.textContent="Mapping the real page structure";
      const introNodes=getTargets(sections[0]);
      animatePointers(introNodes,elapsed,"SELECTING");
    } else if(elapsed<finalStart) {
      const index=Math.min(stages.length-1,Math.floor((elapsed-2)/8.4));
      const stage=stages[index];
      const local=Math.max(0,Math.min(1,(elapsed-stage.start)/stage.duration));
      const action=local<.28?"SELECTING":local<.58?"DRAGGING":local<.82?"RESIZING":"TYPING";
      if(index===0 && local<.04) scrollStart=window.scrollY;
      scrollToSection(stage.id,Math.min(1,local*1.22));
      targetNodes=getTargets(stage);
      stepLabel.textContent=stage.label;
      detailLabel.textContent=action+" · aligning live elements";
      if(targetNodes.length) {
        const target=targetNodes[Math.floor((local*targetNodes.length*1.6)%targetNodes.length)];
        setSelection(target,action+" ELEMENT");
        animatePointers(targetNodes,elapsed,action);
        applyWorkEffect(targetNodes,elapsed,action);
      }
    } else {
      const progress=Math.min(1,(elapsed-finalStart)/finalDuration);
      scrollToSection("contact",Math.min(1,progress*1.5));
      stepLabel.textContent="Final pass: follow and connect";
      detailLabel.textContent=progress<.6?"Finishing social links and footer spacing":"Assembling FOLLOW from 760 particles";
      const nodes=getTargets(sections[4]);
      animatePointers(nodes,elapsed,"RESIZING");
      if(nodes.length) {
        setSelection(nodes[Math.floor(progress*nodes.length)%nodes.length],"FINAL ALIGNMENT");
        applyWorkEffect(nodes,elapsed,"RESIZING");
      }
      followWrap.classList.add("pb-follow-active");
      drawFollow(progress,now);
      if(progress>=1) {
        counter.textContent="COMPLETE · 100%";
        stepLabel.textContent="Website assembled";
        detailLabel.textContent="All sections ready · enjoy the portfolio";
        finish();
        return;
      }
    }

    raf=requestAnimationFrame(frame);
  }

  function begin() {
    window.scrollTo(0,0);
    scrollStart=0;
    start=performance.now();
    raf=requestAnimationFrame(frame);
  }

  skip.addEventListener("click",finish);
  window.addEventListener("beforeunload",()=>{stopped=true;cancelAnimationFrame(raf);});
  begin();
})();
