function drawDial() {
  const dialList = document.querySelector(".clock-dial");
  const fragment = document.createDocumentFragment(); // Fragment 생성

  for (let i = 0; i < 30; i++) {
    const li = document.createElement("li");
    li.className = "dial";
    li.style.transform = `rotate(${i * 6}deg)`;

    if (i % 5 === 0) {
      li.classList.add("thick");
    }

    fragment.appendChild(li);
  }

  dialList.appendChild(fragment);
}

function drawIndex() {
  const indexList = document.querySelector(".clock-index");
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 6; i++) {
    const li = document.createElement("li");
    li.className = "index";
    li.style.transform = `rotate(-${i * 30}deg)`;

    const spanStart = document.createElement("span");
    const spanEnd = document.createElement("span");

    spanStart.innerText = i * 5;
    spanEnd.innerText = 30 + i * 5;

    spanStart.style.transform = `rotate(${i * 30}deg)`;
    spanEnd.style.transform = `rotate(${i * 30}deg)`;

    li.appendChild(spanStart);
    li.appendChild(spanEnd);

    fragment.appendChild(li);
  }

  indexList.appendChild(fragment);
}

drawDial();
drawIndex();
