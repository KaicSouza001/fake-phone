const container = document.getElementById("notifications");

/* --------------------------
   RELÓGIO
--------------------------- */
function atualizarHora() {
  const agora = new Date();
  let h = agora.getHours().toString().padStart(2, "0");
  let m = agora.getMinutes().toString().padStart(2, "0");
  document.getElementById("hora").innerText = `${h}:${m}`;
}

setInterval(atualizarHora, 1000);
atualizarHora();

/* --------------------------
   NOTIFICAÇÕES
--------------------------- */
let notificationSpeed = 4000;
let notificationTimeout;

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

iniciarLoopNotificacao();

/* --------------------------
   PAINEL
--------------------------- */
const hiddenEditorBtn = document.getElementById("hiddenEditorBtn");
const editorPanel = document.getElementById("editorPanel");
const closeEditor = document.getElementById("closeEditor");
const dragMode = document.getElementById("dragMode");
const speedRange = document.getElementById("speedRange");
const speedValue = document.getElementById("speedValue");

hiddenEditorBtn.addEventListener("click", () => {
  editorPanel.classList.toggle("open");
});

closeEditor.addEventListener("click", () => {
  editorPanel.classList.remove("open");
});

speedRange.addEventListener("input", () => {
  notificationSpeed = Number(speedRange.value);
  speedValue.textContent = `${notificationSpeed} ms`;
  iniciarLoopNotificacao();
});

/* --------------------------
   MOSTRAR / ESCONDER ITENS
--------------------------- */
const horaBox = document.getElementById("horaBox");
const signalBox = document.getElementById("signalBox");
const wifiBox = document.getElementById("wifiBox");
const batteryBox = document.getElementById("batteryBox");
const islandBox = document.getElementById("islandBox");
const recordingDot = document.getElementById("recordingDot");

document.getElementById("toggleHora").addEventListener("change", (e) => {
  horaBox.classList.toggle("hidden", !e.target.checked);
});

document.getElementById("toggleSignal").addEventListener("change", (e) => {
  signalBox.classList.toggle("hidden", !e.target.checked);
});

document.getElementById("toggleWifi").addEventListener("change", (e) => {
  wifiBox.classList.toggle("hidden", !e.target.checked);
});

document.getElementById("toggleBattery").addEventListener("change", (e) => {
  batteryBox.classList.toggle("hidden", !e.target.checked);
});

document.getElementById("toggleIsland").addEventListener("change", (e) => {
  islandBox.classList.toggle("hidden", !e.target.checked);
});

document.getElementById("toggleDot").addEventListener("change", (e) => {
  recordingDot.classList.toggle("hidden", !e.target.checked);
});

/* --------------------------
   MODO ARRASTAR
--------------------------- */
const draggables = document.querySelectorAll(".draggable");
let isDragMode = false;

dragMode.addEventListener("change", (e) => {
  isDragMode = e.target.checked;

  draggables.forEach(item => {
    item.classList.toggle("drag-enabled", isDragMode);
  });
});

draggables.forEach(makeDraggable);

function makeDraggable(element) {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  element.addEventListener("mousedown", (e) => {
    if (!isDragMode) return;

    isDragging = true;

    const rect = element.getBoundingClientRect();
    const phoneRect = document.querySelector(".phone").getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    function onMouseMove(ev) {
      if (!isDragging) return;

      let newLeft = ev.clientX - phoneRect.left - offsetX;
      let newTop = ev.clientY - phoneRect.top - offsetY;

      const maxLeft = phoneRect.width - element.offsetWidth;
      const maxTop = phoneRect.height - element.offsetHeight;

      if (newLeft < 0) newLeft = 0;
      if (newTop < 0) newTop = 0;
      if (newLeft > maxLeft) newLeft = maxLeft;
      if (newTop > maxTop) newTop = maxTop;

      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });
}
