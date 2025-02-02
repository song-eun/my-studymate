const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const clockAxis = document.querySelector(".clock-axis");

const COLORS = {
  arc: "rgb(255, 87, 51)",
};

const timerState = {
  degree: 0,
  time: 0,
  timer: null,
  seconds: 0,
};

let canvasWidth, canvasHeight, centerX, centerY;

function toRadian(d) {
  return (d * Math.PI) / 180;
}

function calcAngleDegrees(x, y) {
  let theta = (Math.atan2(y, x) * 180) / Math.PI;
  return theta < 0 ? theta + 360 : theta;
}

function roundToNearestMinute(degree) {
  const minutesInDegree = 360 / 60;
  return Math.round(degree / minutesInDegree) * minutesInDegree;
}

function initializeCanvas() {
  canvasWidth = canvas.offsetWidth;
  canvasHeight = canvas.offsetHeight;

  let pixelRatio = window.devicePixelRatio || 1;
  canvas.width = canvasWidth * pixelRatio;
  canvas.height = canvasHeight * pixelRatio;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;

  ctx.scale(pixelRatio, pixelRatio);

  centerX = Math.floor(canvasWidth / 2);
  centerY = Math.floor(canvasHeight / 2);
}

function drawArc(degree) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(
    centerX,
    centerY,
    Math.floor(canvasHeight / 2),
    // 컴퓨터에서의 각도 단위는 degree값이 아니다. radian값이다.
    toRadian(0),
    toRadian(degree === 0 ? 360 : degree),
    true
  );
  ctx.closePath();
  ctx.fillStyle = COLORS.arc;
  ctx.fill();

  clockAxis.style.transform = `rotate(-${360 - degree}deg)`;
}

function updateArc() {
  timerState.seconds++;
  timerState.degree += 1 / 12;
  drawArc(timerState.degree);

  if (timerState.seconds >= timerState.time) {
    clearInterval(timerState.timer);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  }
}

function handleMouseUp(e) {
  canvas.removeEventListener("mousemove", handleMouseMove);

  let degree = calcAngleDegrees(e.offsetX - centerX, e.offsetY - centerY);

  degree = roundToNearestMinute(degree); // 1분 단위로 각도를 조정

  if (degree >= 360 || degree === 0) {
    degree = 0; // 360도는 0도로 처리
  }

  timerState.degree = degree;
  timerState.time = (360 - degree) * 10;
  timerState.seconds = 0;

  timerState.timer = setInterval(updateArc, 1000);
}

function handleMouseMove(e) {
  if (timerState.timer) clearInterval(timerState.timer);
  // 사이각
  let theta = calcAngleDegrees(e.offsetX - centerX, e.offsetY - centerY);
  theta = roundToNearestMinute(theta); // 1분 단위로 각도를 조정
  drawArc(theta);
}

function handleMouseDown(e) {
  canvas.addEventListener("mousemove", handleMouseMove);
}

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mouseup", handleMouseUp);

initializeCanvas();
