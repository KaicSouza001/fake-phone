const container = document.getElementById("notifications");

/* GERAR VALORES */
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

/* NOTIFICAÇÃO */
function criarNotificacao() {
  const notif = document.createElement("div");
  notif.className = "notification";

  notif.innerHTML = `
    <img src="Imagem Icone/Icone Cakto Mensagens.png">
    <div class="text">
      <strong>Venda aprovada!</strong>
      <p>${gerarValor()}</p>
    </div>
    <span class="time">agora</span>
  `;

  container.prepend(notif);
}

/* LOOP */
function loop() {
  criarNotificacao();
  const tempo = Math.random() * 5000 + 3000;
  setTimeout(loop, tempo);
}

loop();

/* RELÓGIO */
function atualizarHora() {
  const agora = new Date();
  let h = agora.getHours().toString().padStart(2, "0");
  let m = agora.getMinutes().toString().padStart(2, "0");
  document.getElementById("hora").innerText = `${h}:${m}`;
}

setInterval(atualizarHora, 1000);
atualizarHora();
