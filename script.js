const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Persist theme across pages.
const storedTheme = localStorage.getItem("theme");
if (storedTheme === "dark") {
  document.body.classList.add("dark");
}

const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// Reveal sections when they enter viewport.
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
reveals.forEach((el) => observer.observe(el));

// Live time in top-right status panel.
const liveTimeEl = document.getElementById("live-time");
if (liveTimeEl) {
  const tick = () => {
    liveTimeEl.textContent = new Date().toLocaleTimeString();
  };
  tick();
  setInterval(tick, 1000);
}

// Animate metric counters.
document.querySelectorAll("[data-count]").forEach((el) => {
  const target = Number(el.getAttribute("data-count") || 0);
  let value = 0;
  const step = Math.max(1, Math.floor(target / 45));
  const timer = setInterval(() => {
    value += step;
    if (value >= target) {
      value = target;
      clearInterval(timer);
    }
    el.textContent = String(value);
  }, 22);
});

// Filter projects by category.
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.getAttribute("data-filter");

    projectCards.forEach((card) => {
      const category = card.getAttribute("data-category");
      const shouldShow = filter === "all" || category === filter;
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

// Animate horizontal skill bars when visible.
const skillBars = document.querySelectorAll(".bar i");
if (skillBars.length) {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        skillBars.forEach((bar) => {
          const width = bar.style.getPropertyValue("--w");
          bar.style.width = width;
        });
        barObserver.disconnect();
      }
    });
  });
  barObserver.observe(skillBars[0]);
}

function drawThroughputChart() {
  const canvas = document.getElementById("throughput-chart");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const data = [22, 28, 19, 33, 27, 39, 31, 42];
  const { width, height } = canvas;
  const pad = 30;
  const max = Math.max(...data) + 6;

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(143, 155, 184, 0.2)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = pad + ((height - pad * 2) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(width - pad, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#6f7dff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = pad + ((width - pad * 2) / (data.length - 1)) * i;
    const y = height - pad - (v / max) * (height - pad * 2);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = "#29e0ff";
  data.forEach((v, i) => {
    const x = pad + ((width - pad * 2) / (data.length - 1)) * i;
    const y = height - pad - (v / max) * (height - pad * 2);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawSkillsRadar() {
  const canvas = document.getElementById("skills-radar");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const labels = ["Brand", "Photo", "Video", "UX", "Direction", "Code"];
  const values = [92, 88, 85, 74, 90, 70];
  const { width, height } = canvas;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.33;
  const levels = 5;

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(143, 155, 184, 0.2)";
  ctx.fillStyle = "rgba(143, 155, 184, 0.7)";

  for (let l = 1; l <= levels; l++) {
    const r = (radius / levels) * l;
    ctx.beginPath();
    labels.forEach((_, i) => {
      const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();
  }

  labels.forEach((label, i) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    const x = cx + Math.cos(angle) * (radius + 20);
    const y = cy + Math.sin(angle) * (radius + 20);
    ctx.fillStyle = "#8f9bb8";
    ctx.font = "12px PPNeueMontreal, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y);
  });

  ctx.beginPath();
  values.forEach((v, i) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    const r = (v / 100) * radius;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(111, 125, 255, 0.28)";
  ctx.strokeStyle = "#29e0ff";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
}

drawThroughputChart();
drawSkillsRadar();
window.addEventListener("resize", () => {
  drawThroughputChart();
  drawSkillsRadar();
});

// Terminal typing animation.
const logEl = document.getElementById("typed-log");
if (logEl) {
  const lines = [
    "> boot --portfolio-mode=technical",
    "> load_profile Owen_Kan",
    "> role student | designer | photographer | videographer",
    "> init_project academicrights.org --mode=acting-director",
    "> status creative_pipeline: stable",
    "> listening for new collaborations..."
  ];
  let lineIndex = 0;
  let charIndex = 0;

  const type = () => {
    if (lineIndex >= lines.length) return;
    const line = lines[lineIndex];
    logEl.textContent += line[charIndex] || "";
    charIndex += 1;
    if (charIndex > line.length) {
      logEl.textContent += "\n";
      lineIndex += 1;
      charIndex = 0;
      setTimeout(type, 260);
      return;
    }
    setTimeout(type, 18);
  };
  type();
}
