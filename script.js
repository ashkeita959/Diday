const envelopeButton = document.getElementById("envelopeButton");
const introCard = document.getElementById("introCard");
const birthdayCard = document.getElementById("birthdayCard");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const hintText = document.getElementById("hintText");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const birthdaySong = document.getElementById("birthdaySong");
const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");

let yesScale = 1;
let noClicks = 0;
let confettiPieces = [];
let confettiAnimationId = null;
let hasExploded = false;

const noMessages = [
  "The YES button is getting stronger.",
  "Are you sure? YES is growing.",
  "YES really wants to be clicked.",
  "The birthday magic is almost too big.",
  "There is no escaping the YES now."
];

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function showBirthdayCard() {
  introCard.classList.add("hidden");
  birthdayCard.classList.remove("hidden");
}

function growYesButton() {
  if (hasExploded) return;

  noClicks += 1;
  yesScale = Math.min(yesScale + 0.32, 3.6);
  yesButton.style.setProperty("--yes-scale", yesScale);
  hintText.textContent = noMessages[Math.min(noClicks - 1, noMessages.length - 1)];

  if (noClicks >= 5) {
    noButton.textContent = "STILL NO?";
  }
}

function createConfettiPiece() {
  const colors = ["#ffffff", "#bde9ff", "#76c9f4", "#299ed8", "#eaf9ff", "#8edcff"];

  return {
    x: Math.random() * confettiCanvas.width,
    y: -20 - Math.random() * confettiCanvas.height * 0.4,
    size: 7 + Math.random() * 10,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: 3 + Math.random() * 6,
    speedX: -2.5 + Math.random() * 5,
    rotation: Math.random() * Math.PI,
    rotationSpeed: -0.18 + Math.random() * 0.36,
    opacity: 1
  };
}

function startConfetti() {
  confettiPieces = Array.from({ length: 220 }, createConfettiPiece);

  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
  }

  animateConfetti();

  setTimeout(() => {
    confettiPieces.forEach((piece) => {
      piece.fade = true;
    });
  }, 3600);
}

function animateConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiPieces.forEach((piece) => {
    piece.x += piece.speedX;
    piece.y += piece.speedY;
    piece.rotation += piece.rotationSpeed;

    if (piece.fade) {
      piece.opacity -= 0.012;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(piece.opacity, 0);
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.62);
    ctx.restore();
  });

  confettiPieces = confettiPieces.filter((piece) => piece.opacity > 0 && piece.y < confettiCanvas.height + 80);

  if (confettiPieces.length > 0) {
    confettiAnimationId = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiAnimationId = null;
  }
}

function playBirthdaySong() {
  birthdaySong.volume = 0.85;
  birthdaySong.currentTime = 0;

  const playPromise = birthdaySong.play();

  if (playPromise) {
    playPromise.catch(() => {
      hintText.textContent = "Tap YES again if your browser paused the song.";
    });
  }
}

function explodeYesButton() {
  if (hasExploded) return;

  hasExploded = true;
  hintText.textContent = "YES exploded into birthday magic.";
  yesButton.classList.add("explode");
  noButton.disabled = true;
  startConfetti();

  setTimeout(() => {
    playBirthdaySong();
    popup.classList.remove("hidden");
  }, 650);
}

function closeBirthdayPopup() {
  popup.classList.add("hidden");
}

/* Extend these event handlers to add more birthday surprises. */
envelopeButton.addEventListener("click", showBirthdayCard);
noButton.addEventListener("click", growYesButton);
yesButton.addEventListener("click", explodeYesButton);
closePopup.addEventListener("click", closeBirthdayPopup);

popup.addEventListener("click", (event) => {
  if (event.target === popup) {
    closeBirthdayPopup();
  }
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
