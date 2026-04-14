const lockscreen = document.getElementById("lockscreen");
const passwordScreen = document.getElementById("passwordScreen");
const system = document.getElementById("system");
const container = document.getElementById("notifications");

let senha = "";

/* DESLIZAR PRA ABRIR */
lockscreen.addEventListener("click", () => {
  passwordScreen.style.display = "flex";
});

/* DIGITAR SENHA */
function digitar(num) {
  senha += num;

  if (senha.length === 4) {
    if (senha === "1234") {
      passwordScreen.style.display = "none";
      lockscreen.style.display = "none";
      system.style.display = "block";
    }
    senha = "";
  }
}

/* VALORES REALISTAS */
function gerarValor() {
  const tipo = Math.random();

  if (tipo < 0.4) {
    return "R$ " + (Math.random() * 50 + 10).toFixed(2).replace(".", ",");
  } else if (tipo < 0.8) {
    return "R$ " + (Math.random() * 300 + 50).toFixed(2).replace(".", ",");
  } else {
    return "R$ " + (Math.random() * 1000 + 300).toFixed(2).replace(".", ",");
  }
}

/* NOTIFICAÇÕES */
function criarNotificacao() {
  const notif = document.createElement("div");
  notif.className = "notification";

  notif.innerHTML = `
    <img src="Imagem Icone/Icone Cakto Mensagens.png">
    <div class="text">
      <strong>Venda aprovada!</strong>
      <p>${gerarValor()}</p>
    </div>
  `;

  container.prepend(notif);
}

/* LOOP ALEATÓRIO */
function loop() {
  criarNotificacao();
  setTimeout(loop, Math.random() * 3000 + 1000);
}

loop();

/* HORA */
function atualizarHora() {
  const agora = new Date();
  document.getElementById("hora").innerText =
    agora.getHours().toString().padStart(2, "0") + ":" +
    agora.getMinutes().toString().padStart(2, "0");

  document.getElementById("lockTime").innerText =
    document.getElementById("hora").innerText;
}

setInterval(atualizarHora, 1000);
atualizarHora();
