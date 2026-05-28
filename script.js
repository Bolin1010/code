const canvas = document.querySelector(".thread-field");
const context = canvas.getContext("2d");
const hero = document.querySelector(".hero");
const links = document.querySelectorAll(".nav-links a");
const sections = [...document.querySelectorAll("section[id]")];

let width = 0;
let height = 0;
let pointer = { x: 0.68, y: 0.42 };
let time = 0;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = hero.offsetWidth;
  height = hero.offsetHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawThread() {
  time += 0.006;
  context.clearRect(0, 0, width, height);

  const startX = width * 0.08;
  const endX = width * 0.92;
  const baseY = height * (0.52 + (pointer.y - 0.5) * 0.12);

  context.lineWidth = 1.4;
  context.strokeStyle = "rgba(193, 18, 31, 0.72)";
  context.shadowColor = "rgba(193, 18, 31, 0.8)";
  context.shadowBlur = 16;
  context.beginPath();

  for (let i = 0; i <= 160; i += 1) {
    const progress = i / 160;
    const x = startX + (endX - startX) * progress;
    const pull = Math.sin(progress * Math.PI) * (pointer.x - 0.5) * width * 0.08;
    const y = baseY + Math.sin(progress * Math.PI * 4 + time * 10) * 18 + pull;
    if (i === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }

  context.stroke();
  context.shadowBlur = 0;

  for (let i = 0; i < 18; i += 1) {
    const progress = i / 17;
    const x = startX + (endX - startX) * progress;
    const y = baseY + Math.sin(progress * Math.PI * 4 + time * 10) * 18;
    const radius = 1.2 + Math.sin(time * 18 + i) * 0.55;
    context.fillStyle = i % 3 === 0 ? "rgba(217, 154, 61, 0.7)" : "rgba(248, 244, 234, 0.45)";
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  requestAnimationFrame(drawThread);
}

function setActiveLink() {
  let current = null;
  for (let index = sections.length - 1; index >= 0; index -= 1) {
    if (sections[index].getBoundingClientRect().top < window.innerHeight * 0.36) {
      current = sections[index];
      break;
    }
  }
  links.forEach((link) => {
    const isActive = current && link.getAttribute("href") === `#${current.id}`;
    link.classList.toggle("is-active", Boolean(isActive));
  });
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("scroll", setActiveLink, { passive: true });
window.addEventListener("pointermove", (event) => {
  pointer = {
    x: event.clientX / Math.max(window.innerWidth, 1),
    y: event.clientY / Math.max(window.innerHeight, 1),
  };
});

resizeCanvas();
setActiveLink();
drawThread();
