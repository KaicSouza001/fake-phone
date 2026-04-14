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

const presetNameInput = document.getElementById("presetName");
const presetList = document.getElementById("presetList");
const savePresetBtn = document.getElementById("savePreset");
const loadPresetBtn = document.getElementById("loadPreset");
const deletePresetBtn = document.getElementById("deletePreset");

const draggableItems = document.querySelectorAll(".draggable");
const selectableItems = document.querySelectorAll(".selectable");

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
  speed: "fakePhone_speed",
  presets: "fakePhone_presets"
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
   HELPERS
--------------------------- */
function getDefaultPositions() {
  return {
    horaBox: { left: 18, top: 16 },
    islandBox: { left: 118, top: 12 },
    signalBox: { left: 275, top: 18 },
    wifiBox: { left: 298, top: 18 },
    batteryBox: { left: 320, top: 18 },
    recordingDot: { left: 24, top: 10 }
  };
}

function clampPosition(element, left, top, parent = phone) {
  const maxLeft = parent.clientWidth - element.offsetWidth;
  const maxTop = parent.clientHeight - element.offsetHeight;

  const clampedLeft = Math.max(0, Math.min(left, maxLeft));
  const clampedTop = Math.max(0, Math.min(top, maxTop));

  return { left: clampedLeft, top: clampedTop };
}

function getAllCurrentPositions() {
  const positions = {};

  draggableItems.forEach((item) => {
    positions[item.id] = {
      left: parseInt(item.style.left, 10) || 0,
      top: parseInt(item.style.top, 10) || 0
    };
  });

  return positions;
}

function isInsideIsland(element) {
  return element.id === "recordingDot";
}

function getParentForElement(element) {
  if (isInsideIsland(element)) {
    return islandBox;
  }
  return phone;
}

function getSafePositionForElement(element, left, top) {
  const parent = getParentForElement(element);
  return clampPosition(element, left, top, parent);
}

function setElementPosition(element, left, top) {
  const pos = getSafePositionForElement(element, left, top);
  element.style.left = `${pos.left}px`;
  element.style.top = `${pos.top}px`;
}

function updateXYInputs(element) {
  posXInput.value = parseInt(element.style.left, 10) || 0;
  posYInput.value = parseInt(element.style.top, 10) || 0;
}

function clearSelection() {
  selectableItems.forEach((item) => item.classList.remove("selected-item"));
}

function applyColors() {
  document.documentElement.style.setProperty("--signal-color", signalColorInput.value);
  document.documentElement.style.setProperty("--wifi-color", wifiColorInput.value);
  document.documentElement.style.setProperty("--battery-color", batteryColorInput.value);
}

/* --------------------------
   SELEÇÃO
--------------------------- */
function selectElement(element) {
  clearSelection();
  selectedElement = element;
  selectedElement.classList.add("selected-item");

  selectedItemLabel.textContent = `Item selecionado: ${selectedElement.dataset.name || selectedElement.id}`;
  updateXYInputs(selectedElement);
}

/* --------------------------
   SALVAR / CARREGAR ESTADO
--------------------------- */
function savePositions() {
  localStorage.setItem(STORAGE_KEYS.positions, JSON.stringify(getAllCurrentPositions()));
}

function loadPositions() {
  const saved = localStorage.getItem(STORAGE_KEYS.positions);
  if (!saved) return;

  const positions = JSON.parse(saved);

  draggableItems.forEach((item) => {
    if (positions[item.id]) {
      setElementPosition(item, positions[item.id].left, positions[item.id].top);
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
   PRESETS
--------------------------- */
function getPresets() {
  const saved = localStorage.getItem(STORAGE_KEYS.presets);
  return saved ? JSON.parse(saved) : {};
}

function savePresetsObject(presets) {
  localStorage.setItem(STORAGE_KEYS.presets, JSON.stringify(presets));
}

function refreshPresetList() {
  const presets = getPresets();
  presetList.innerHTML = "";

  const names = Object.keys(presets);

  names.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    presetList.appendChild(option);
  });
}

function savePreset() {
  const name = presetNameInput.value.trim();

  if (!name) {
    alert("Digite um nome para o preset.");
    return;
  }

  const presets = getPresets();

  presets[name] = {
    positions: getAllCurrentPositions()
  };

  savePresetsObject(presets);
  refreshPresetList();
  presetList.value = name;
  presetNameInput.value = "";
}

function loadPreset() {
  const selectedName = presetList.value;
  if (!selectedName) {
    alert("Selecione um preset.");
    return;
  }

  const presets = getPresets();
  const preset = presets[selectedName];

  if (!preset || !preset.positions) return;

  draggableItems.forEach((item) => {
    if (preset.positions[item.id]) {
      setElementPosition(item, preset.positions[item.id].left, preset.positions[item.id].top);
    }
  });

  if (selectedElement) {
    updateXYInputs(selectedElement);
  }

  savePositions();
}

function deletePreset() {
  const selectedName = presetList.value;
  if (!selectedName) {
    alert("Selecione um preset para excluir.");
    return;
  }

  const presets = getPresets();
  delete presets[selectedName];
  savePresetsObject(presets);
  refreshPresetList();
}

/* --------------------------
   PAINEL
--------------------------- */
function openPanel() {
  editorPanel.classList.add("open");
  hiddenEditorBtn.classList.add("disabled-open");
}

function closePanel() {
  editorPanel.classList.remove("open");
  hiddenEditorBtn.classList.remove("disabled-open");
}

function togglePanel() {
  const isOpen = editorPanel.classList.contains("open");

  if (isOpen) {
    closePanel();
  } else {
    openPanel();
  }
}

hiddenEditorBtn.addEventListener("dblclick", () => {
  togglePanel();
});

closeEditor.addEventListener("click", () => {
  closePanel();
});

/* --------------------------
   VELOCIDADE
--------------------------- */
speedRange.addEventListener("input", () => {
  notificationSpeed = Number(speedRange.value);
  speedValue.textContent = `${notificationSpeed} ms`;
  saveSpeed();
  iniciarLoopNotificacao();
});

/* --------------------------
   VISIBILIDADE
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
   CORES
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
   X / Y
--------------------------- */
function applyPositionToSelected() {
  if (!selectedElement) return;

  let x = parseInt(posXInput.value, 10);
  let y = parseInt(posYInput.value, 10);

  if (isNaN(x)) x = 0;
  if (isNaN(y)) y = 0;

  setElementPosition(selectedElement, x, y);
  updateXYInputs(selectedElement);
  savePositions();
}

applyPositionBtn.addEventListener("click", applyPositionToSelected);
posXInput.addEventListener("change", applyPositionToSelected);
posYInput.addEventListener("change", applyPositionToSelected);

/* --------------------------
   RESETAR POSIÇÕES
--------------------------- */
resetPositionsBtn.addEventListener("click", () => {
  const defaults = getDefaultPositions();

  draggableItems.forEach((item) => {
    if (defaults[item.id]) {
      setElementPosition(item, defaults[item.id].left, defaults[item.id].top);
    }
  });

  if (selectedElement) {
    updateXYInputs(selectedElement);
  }

  savePositions();
});

/* --------------------------
   PRESETS EVENTOS
--------------------------- */
savePresetBtn.addEventListener("click", savePreset);
loadPresetBtn.addEventListener("click", loadPreset);
deletePresetBtn.addEventListener("click", deletePreset);

presetList.addEventListener("change", () => {
  presetNameInput.value = presetList.value;
});

/* --------------------------
   SELECIONAR ITEM
--------------------------- */
selectableItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.stopPropagation();
    selectElement(item);
  });
});

/* --------------------------
   MODO ARRASTAR
--------------------------- */
dragMode.addEventListener("change", (e) => {
  isDragMode = e.target.checked;

  draggableItems.forEach((item) => {
    item.classList.toggle("drag-enabled", isDragMode);
  });
});

draggableItems.forEach(makeDraggable);

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

    setElementPosition(element, initialLeft + deltaX, initialTop + deltaY);
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
   CLIQUE FORA DO PAINEL
--------------------------- */
document.addEventListener("click", (e) => {
  const clickedInsidePanel = editorPanel.contains(e.target);
  const clickedButton = hiddenEditorBtn.contains(e.target);

  if (!clickedInsidePanel && !clickedButton && editorPanel.classList.contains("open")) {
    clearSelection();
    if (selectedElement) {
      selectedElement.classList.add("selected-item");
    }
  }
});

/* --------------------------
   INICIALIZAÇÃO
--------------------------- */
function applyDefaultPositionsIfNeeded() {
  const saved = localStorage.getItem(STORAGE_KEYS.positions);
  if (saved) return;

  const defaults = getDefaultPositions();

  draggableItems.forEach((item) => {
    if (defaults[item.id]) {
      setElementPosition(item, defaults[item.id].left, defaults[item.id].top);
    }
  });

  savePositions();
}

function init() {
  applyDefaultPositionsIfNeeded();
  loadPositions();
  loadVisibility();
  loadColors();
  loadSpeed();
  refreshPresetList();
  applyColors();

  speedValue.textContent = `${notificationSpeed} ms`;

  selectElement(horaBox);
  iniciarLoopNotificacao();
}

init();
