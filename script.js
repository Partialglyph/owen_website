const currentPage = document.body.dataset.page || "";
document.querySelectorAll("[data-nav]").forEach((link) => {
  if (link.getAttribute("data-nav") === currentPage) {
    link.classList.add("active");
  }
});

const vanTime = document.getElementById("van-time");
if (vanTime) {
  const format = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  const tick = () => {
    vanTime.textContent = format.format(new Date());
  };
  tick();
  setInterval(tick, 1000);
}

document.querySelectorAll("[data-count]").forEach((el) => {
  const target = Number(el.getAttribute("data-count") || "0");
  let value = 0;
  const step = Math.max(1, Math.round(target / 36));
  const timer = setInterval(() => {
    value += step;
    if (value >= target) {
      value = target;
      clearInterval(timer);
    }
    el.textContent = String(value);
  }, 20);
});

document.querySelectorAll(".bar i").forEach((bar) => {
  const width = bar.style.getPropertyValue("--w");
  requestAnimationFrame(() => {
    bar.style.width = width;
  });
});

function drawCluster() {
  const canvas = document.getElementById("cluster-canvas");
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const points = [];
  const { width, height } = canvas;
  const count = 70;
  for (let i = 0; i < count; i += 1) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 2 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25
    });
  }

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 90) {
          ctx.strokeStyle =
            dist < 45 ? "rgba(99,208,255,0.28)" : "rgba(255,157,87,0.12)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }

    points.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.fillStyle = idx % 7 === 0 ? "#ff9d57" : "#63d0ff";
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  };
  draw();
}

drawCluster();
