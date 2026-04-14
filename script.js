const phone = document.getElementById("phone");
const container = document.getElementById("notifications");

/* --------------------------
   ELEMENTOS
--------------------------- */
const hiddenEditorBtn = document.getElementById("hiddenEditorBtn");
const editorPanel = document.getElementById("editorPanel");
const closeEditor = document.getElementById("closeEditor");
const dragMode = document.getElementById("dragMode");
const speedRange = document.getElementById("speedRange");
const speedValue = document.getElementById("speedValue");

const horaBox = document.getElementById("horaBox");
const signalBox = document.getElementById("signalBox");
const wifiBox = document.getElementById("wifiBox");
const batteryBox = document.getElementById("batteryBox");
const islandBox = document.getElementById("islandBox");
const recordingDot = document.getElementById("recordingDot");

const toggleHora = document.getElementById("toggleHora");
const toggleSignal = document.getElementById("toggleSignal");
const toggleWifi = document.getElementById("toggleWifi");
const toggleBattery = document.getElementById("toggleBattery");
const toggleIsland = document.getElementById("toggleIsland");
const toggleDot = document.getElementById("toggleDot");

const signalColorInput = document.getElementById("signalColor");
const wifiColorInput = document.getElementById("wifiColor");
const batteryColorInput = document.getElementById("batteryColor");

const posXInput = document.getElementById("posX");
const posYInput = document.getElementById("posY");
const applyPositionBtn = document.getElementById("applyPosition");
const selectedItemLabel = document.getElementById("selectedItemLabel");
const resetPositionsBtn = document.getElementById("resetPositions");

const draggables = document.querySelectorAll(".draggable");

let notificationSpeed = 4000;
let notificationTimeout;
let isDragMode = false;
let selectedElement = null;

/* --------------------------
   STORAGE KEYS
--------------------------- */
const STORAGE_KEYS = {
  positions: "fakePhone_positions",
  visibility: "fakePhone_visibility",
  colors: "fakePhone_colors",
  speed: "fakePhone_speed"
};

/* --------------------------
   RELÓGIO
--------------------------- */
function atualizarHora() {
  const agora = new Date();
  const h = agora.getHours().toString().padStart(2, "0");
  const m = agora.getMinutes().toString().padStart(2, "0");
  document.getElementById("hora").innerText = `${h}:${m}`;
}

setInterval(atualizarHora, 1000);
atualizarHora();

/* --------------------------
   NOTIFICAÇÕES
--------------------------- */
function gerarValor() {
  const tipo = Math.random();

  if (tipo < 0.4) {
    return "R$ " + (Math.random() * 40 + 10).toFixed(2).replace(".", ",");
  } else if (tipo < 0.8) {
    return "R$ " + (Math.random() * 250 + 50).toFixed(2).replace(".", ",");
  } else {
    return "R$ " + (Math.random() * 1000 + 300).toFixed(2).replace(".", ",");
  }
}

function criarNotificacao() {
  const notif = document.createElement("div");
  notif.className = "notification";

  notif.innerHTML = `
    <img src="Imagem Icone/Icone Cakto Mensagens.png" alt="Ícone">
    <div class="text">
      <strong>Venda aprovada!</strong>
      <p>${gerarValor()}</p>
    </div>
    <span class="time">agora</span>
  `;

  container.prepend(notif);

  if (container.children.length > 20) {
    container.removeChild(container.lastChild);
  }
}

function iniciarLoopNotificacao() {
  clearTimeout(notificationTimeout);

  function loop() {
    criarNotificacao();

    const variacao = Math.floor(Math.random() * 1500);
    const tempoFinal = notificationSpeed + variacao;

    notificationTimeout = setTimeout(loop, tempoFinal);
  }

  loop();
}

/* --------------------------
   SALVAR / CARREGAR
--------------------------- */
function savePositions() {
  const positions = {};

  draggables.forEach((item) => {
    positions[item.id] = {
      left: parseInt(item.style.left, 10) || 0,
      top: parseInt(item.style.top, 10) || 0
    };
  });

  localStorage.setItem(STORAGE_KEYS.positions, JSON.stringify(positions));
}

function loadPositions() {
  const saved = localStorage.getItem(STORAGE_KEYS.positions);
  if (!saved) return;

  const positions = JSON.parse(saved);

  draggables.forEach((item) => {
    if (positions[item.id]) {
      item.style.left = `${positions[item.id].left}px`;
      item.style.top = `${positions[item.id].top}px`;
    }
  });
}

function saveVisibility() {
  const visibility = {
    hora: toggleHora.checked,
    signal: toggleSignal.checked,
    wifi: toggleWifi.checked,
    battery: toggleBattery.checked,
    island: toggleIsland.checked,
    dot: toggleDot.checked
  };

  localStorage.setItem(STORAGE_KEYS.visibility, JSON.stringify(visibility));
}

function loadVisibility() {
  const saved = localStorage.getItem(STORAGE_KEYS.visibility);
  if (!saved) return;

  const visibility = JSON.parse(saved);

  toggleHora.checked = visibility.hora ?? true;
  toggleSignal.checked = visibility.signal ?? true;
  toggleWifi.checked = visibility.wifi ?? true;
  toggleBattery.checked = visibility.battery ?? true;
  toggleIsland.checked = visibility.island ?? true;
  toggleDot.checked = visibility.dot ?? true;

  horaBox.classList.toggle("hidden", !toggleHora.checked);
  signalBox.classList.toggle("hidden", !toggleSignal.checked);
  wifiBox.classList.toggle("hidden", !toggleWifi.checked);
  batteryBox.classList.toggle("hidden", !toggleBattery.checked);
  islandBox.classList.toggle("hidden", !toggleIsland.checked);
  recordingDot.classList.toggle("hidden", !toggleDot.checked);
}

function saveColors() {
  const colors = {
    signal: signalColorInput.value,
    wifi: wifiColorInput.value,
    battery: batteryColorInput.value
  };

  localStorage.setItem(STORAGE_KEYS.colors, JSON.stringify(colors));
}

function loadColors() {
  const saved = localStorage.getItem(STORAGE_KEYS.colors);
  if (!saved) return;

  const colors = JSON.parse(saved);

  if (colors.signal) signalColorInput.value = colors.signal;
  if (colors.wifi) wifiColorInput.value = colors.wifi;
  if (colors.battery) batteryColorInput.value = colors.battery;

  applyColors();
}

function saveSpeed() {
  localStorage.setItem(STORAGE_KEYS.speed, String(notificationSpeed));
}

function loadSpeed() {
  const saved = localStorage.getItem(STORAGE_KEYS.speed);
  if (!saved) return;

  notificationSpeed = Number(saved);
  speedRange.value = notificationSpeed;
  speedValue.textContent = `${notificationSpeed} ms`;
}

/* --------------------------
   CORES
--------------------------- */
function applyColors() {
  document.documentElement.style.setProperty("--signal-color", signalColorInput.value);
  document.documentElement.style.setProperty("--wifi-color", wifiColorInput.value);
  document.documentElement.style.setProperty("--battery-color", batteryColorInput.value);
}

/* --------------------------
   SELEÇÃO
--------------------------- */
function selectElement(element) {
  draggables.forEach((item) => item.classList.remove("selected-item"));

  selectedElement = element;
  selectedElement.classList.add("selected-item");

  selectedItemLabel.textContent = `Item selecionado: ${selectedElement.dataset.name || selectedElement.id}`;
  posXInput.value = parseInt(selectedElement.style.left, 10) || 0;
  posYInput.value = parseInt(selectedElement.style.top, 10) || 0;
}

function updateXYInputs(element) {
  posXInput.value = parseInt(element.style.left, 10) || 0;
  posYInput.value = parseInt(element.style.top, 10) || 0;
}

/* --------------------------
   POSIÇÃO
--------------------------- */
function clampPosition(element, left, top) {
  const maxLeft = phone.clientWidth - element.offsetWidth;
  const maxTop = phone.clientHeight - element.offsetHeight;

  const clampedLeft = Math.max(0, Math.min(left, maxLeft));
  const clampedTop = Math.max(0, Math.min(top, maxTop));

  return { left: clampedLeft, top: clampedTop };
}

function applyPositionToSelected() {
  if (!selectedElement) return;

  let x = parseInt(posXInput.value, 10);
  let y = parseInt(posYInput.value, 10);

  if (isNaN(x)) x = 0;
  if (isNaN(y)) y = 0;

  const pos = clampPosition(selectedElement, x, y);

  selectedElement.style.left = `${pos.left}px`;
  selectedElement.style.top = `${pos.top}px`;

  updateXYInputs(selectedElement);
  savePositions();
}

/* --------------------------
   PAINEL
--------------------------- */
hiddenEditorBtn.addEventListener("dblclick", () => {
  editorPanel.classList.toggle("open");
});

closeEditor.addEventListener("click", () => {
  editorPanel.classList.remove("open");
});

speedRange.addEventListener("input", () => {
  notificationSpeed = Number(speedRange.value);
  speedValue.textContent = `${notificationSpeed} ms`;
  saveSpeed();
  iniciarLoopNotificacao();
});

/* --------------------------
   MOSTRAR / ESCONDER ITENS
--------------------------- */
toggleHora.addEventListener("change", (e) => {
  horaBox.classList.toggle("hidden", !e.target.checked);
  saveVisibility();
});

toggleSignal.addEventListener("change", (e) => {
  signalBox.classList.toggle("hidden", !e.target.checked);
  saveVisibility();
});

toggleWifi.addEventListener("change", (e) => {
  wifiBox.classList.toggle("hidden", !e.target.checked);
  saveVisibility();
});

toggleBattery.addEventListener("change", (e) => {
  batteryBox.classList.toggle("hidden", !e.target.checked);
  saveVisibility();
});

toggleIsland.addEventListener("change", (e) => {
  islandBox.classList.toggle("hidden", !e.target.checked);
  saveVisibility();
});

toggleDot.addEventListener("change", (e) => {
  recordingDot.classList.toggle("hidden", !e.target.checked);
  saveVisibility();
});

/* --------------------------
   CORES INPUT
--------------------------- */
signalColorInput.addEventListener("input", () => {
  applyColors();
  saveColors();
});

wifiColorInput.addEventListener("input", () => {
  applyColors();
  saveColors();
});

batteryColorInput.addEventListener("input", () => {
  applyColors();
  saveColors();
});

/* --------------------------
   APLICAR X/Y
--------------------------- */
applyPositionBtn.addEventListener("click", applyPositionToSelected);

posXInput.addEventListener("change", applyPositionToSelected);
posYInput.addEventListener("change", applyPositionToSelected);

/* --------------------------
   RESETAR POSIÇÕES
--------------------------- */
resetPositionsBtn.addEventListener("click", () => {
  const defaults = {
    horaBox: { left: 18, top: 16 },
    islandBox: { left: 118, top: 12 },
    signalBox: { left: 275, top: 18 },
    wifiBox: { left: 298, top: 18 },
    batteryBox: { left: 320, top: 18 }
  };

  draggables.forEach((item) => {
    if (defaults[item.id]) {
      item.style.left = `${defaults[item.id].left}px`;
      item.style.top = `${defaults[item.id].top}px`;
    }
  });

  if (selectedElement) {
    updateXYInputs(selectedElement);
  }

  savePositions();
});

/* --------------------------
   MODO ARRASTAR
--------------------------- */
dragMode.addEventListener("change", (e) => {
  isDragMode = e.target.checked;

  draggables.forEach((item) => {
    item.classList.toggle("drag-enabled", isDragMode);
  });
});

draggables.forEach(makeDraggable);

function makeDraggable(element) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  element.addEventListener("mousedown", (e) => {
    selectElement(element);

    if (!isDragMode) return;

    e.preventDefault();
    e.stopPropagation();

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    initialLeft = parseInt(element.style.left, 10) || 0;
    initialTop = parseInt(element.style.top, 10) || 0;

    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    const pos = clampPosition(
      element,
      initialLeft + deltaX,
      initialTop + deltaY
    );

    element.style.left = `${pos.left}px`;
    element.style.top = `${pos.top}px`;

    updateXYInputs(element);
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;

    isDragging = false;
    document.body.style.userSelect = "";
    savePositions();
  });
}

/* --------------------------
   INICIALIZAÇÃO
--------------------------- */
function init() {
  loadPositions();
  loadVisibility();
  loadColors();
  loadSpeed();

  applyColors();
  speedValue.textContent = `${notificationSpeed} ms`;

  selectElement(horaBox);
  iniciarLoopNotificacao();
}

init();
