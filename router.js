// ===================== NAVEGAÇÃO PRINCIPAL =====================
const ROUTES = ["inicio", "mundodev", "globalit"];

function navegarPara(rota) {
  if (!ROUTES.includes(rota)) rota = "inicio";

  document.querySelectorAll(".view").forEach((el) => {
    el.hidden = el.id !== `view-${rota}`;
  });
  document.querySelectorAll(".tab").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.route === rota);
  });
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function rotaAtual() {
  return (location.hash || "#inicio").replace("#", "");
}

window.addEventListener("hashchange", () => navegarPara(rotaAtual()));
