const container = document.getElementById("notifications");

// gerar valor aleatório REALISTA
function gerarValor() {
  const valor = (Math.random() * 500 + 50).toFixed(2);
  return "R$ " + valor.replace(".", ",");
}

// criar notificação
function criarNotificacao() {
  const notif = document.createElement("div");
  notif.className = "notification";

  notif.innerHTML = `
    <img src="Imagem Icone/Icone Cakto Mensagens.png">
    <div class="text">
      <strong>Venda aprovada!</strong>
      <p>Sua comissão: ${gerarValor()}</p>
    </div>
    <span class="time">agora</span>
  `;

  container.prepend(notif);
}

// TEMPO ALEATÓRIO (1s até 4s)
function loopNotificacoes() {
  criarNotificacao();

  const tempo = Math.random() * 3000 + 1000;

  setTimeout(loopNotificacoes, tempo);
}

loopNotificacoes();

// RELÓGIO REAL
function atualizarHora() {
  const agora = new Date();
  let h = agora.getHours().toString().padStart(2, "0");
  let m = agora.getMinutes().toString().padStart(2, "0");

  document.getElementById("hora").innerText = `${h}:${m}`;
}

setInterval(atualizarHora, 1000);
atualizarHora();
