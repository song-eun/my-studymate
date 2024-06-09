const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const clockAxis = document.querySelector(".clock-axis");

let wWidth, wHeight, ratio;
let centerX, centerY;

const RED = "rgb(255, 87, 51)";

function toRadian(d) {
  return (d * Math.PI) / 180;
}

function calcAngleDegrees(x, y) {
  let theta_x = (Math.atan2(y, x) * 180) / Math.PI;
  return theta_x < 0 ? theta_x + 360 : theta_x;
}

function calcActualDegree(angle) {
  return 360 - angle;
}

function initializeCanvas() {
  wWidth = canvas.offsetWidth;
  wHeight = canvas.offsetHeight;

  let devicePixelRatio = window.devicePixelRatio || 1;
  let backingStoreRatio =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;

  ratio = devicePixelRatio / backingStoreRatio;

  canvas.width = wWidth * ratio;
  canvas.height = wHeight * ratio;
  canvas.style.width = `${wWidth}px`;
  canvas.style.height = `${wHeight}px`;

  ctx.scale(ratio, ratio);

  centerX = Math.floor(wWidth / 2);
  centerY = Math.floor(wHeight / 2);
}

function drawArc(degree) {
  ctx.clearRect(0, 0, wWidth, wHeight);
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(
    centerX,
    centerY,
    Math.floor(wHeight / 2),
    // 컴퓨터에서의 각도 단위는 degree값이 아니다. radian값이다.
    toRadian(0),
    toRadian(degree),
    true
  );
  ctx.closePath();
  ctx.fillStyle = RED;
  ctx.fill();

  clockAxis.style.transform = `rotate(-${calcActualDegree(degree)}deg)`;
}

let setDegree;
let setTime;
let timer;
let seconds = 0;

function updateArc() {
  seconds++;
  setDegree += 1 / 12;

  drawArc(setDegree);

  if (seconds >= setTime) {
    clearInterval(timer);
    ctx.clearRect(0, 0, wWidth, wHeight);
  }
}

function mouseover(e) {
  seconds = 0;

  canvas.removeEventListener("mousemove", mousemove);

  setDegree = calcAngleDegrees(e.offsetX - centerX, e.offsetY - centerY);
  setTime = calcActualDegree(setDegree) * 10;

  timer = setInterval(updateArc, 1000);
}

function roundToNearestMinute(degree) {
  return (Math.round((degree * 60) / 360) * 360) / 60;
}

function mousemove(e) {
  if (timer) clearInterval(timer);
  // 사이각
  let theta = calcAngleDegrees(e.offsetX - centerX, e.offsetY - centerY);
  drawArc(theta);
}

function click(e) {
  canvas.addEventListener("mousemove", mousemove);
}

canvas.addEventListener("mousedown", click);
canvas.addEventListener("mouseup", mouseover);

initializeCanvas();
