// ===================== BOOT =====================
document.addEventListener("DOMContentLoaded", async () => {
  // Aguarda a tentativa de leitura do Firestore (firebase-data.js) antes de
  // renderizar. Se o Firestore não responder, a Promise resolve mesmo assim
  // e os dados locais de data.js seguem valendo.
  if (window.dadosProntos) await window.dadosProntos;

  iniciarPaginaInicio();
  iniciarMundoDev();
  iniciarGlobalIT();
  navegarPara(rotaAtual());
});
