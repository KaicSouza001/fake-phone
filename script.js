const container = document.getElementById("notifications");

// lista de valores (pode editar depois)
const valores = [
  "R$ 294,51",
  "R$ 479,65",
  "R$ 244,51",
  "R$ 189,90",
  "R$ 512,22"
];

// função criar notificação
function criarNotificacao() {
  const valor = valores[Math.floor(Math.random() * valores.length)];

  const notif = document.createElement("div");
  notif.className = "notification";

  notif.innerHTML = `
    <img src="Imagem Icone/Icone Cakto Mensagens.png">
    <div class="text">
      <strong>Venda aprovada!</strong>
      <p>Sua comissão: ${valor}</p>
    </div>
    <span class="time">agora</span>
  `;

  container.prepend(notif);
}

// gerar automaticamente a cada 2 segundos
setInterval(criarNotificacao, 2000);

// atualizar hora real
function atualizarHora() {
  const agora = new Date();
  let h = agora.getHours().toString().padStart(2, "0");
  let m = agora.getMinutes().toString().padStart(2, "0");

  document.getElementById("hora").innerText = `${h}:${m}`;
}

setInterval(atualizarHora, 1000);
atualizarHora();
