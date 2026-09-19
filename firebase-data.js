// =====================================================================
// Conecta o site estático ao MESMO banco Firestore usado pelo protótipo
// Streamlit (firestore_data.py) — projeto "ti-sem-fronteiras-f0fa9".
//
// Se a config abaixo não estiver preenchida, ou se a leitura falhar por
// qualquer motivo, o site cai automaticamente para os dados locais de
// data.js — igual ao comportamento do protótipo em Python.
// =====================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// -----------------------------------------------------------------
// 1) COLE AQUI a config do "app Web" do MESMO projeto Firebase usado
//    no protótipo (ti-sem-fronteiras-f0fa9):
//
//    Console Firebase → ⚙️ Configurações do projeto → aba "Geral" →
//    seção "Seus apps" → se não existir nenhum app com ícone </>,
//    clique em "Adicionar app" → Web → dê um nome (ex: "site") →
//    NÃO marque Firebase Hosting → "Registrar app".
//    O objeto firebaseConfig aparece na tela seguinte — copie e cole
//    exatamente aqui embaixo.
// -----------------------------------------------------------------
const firebaseConfig = {
  apiKey: "COLE_AQUI_SUA_API_KEY",
  authDomain: "ti-sem-fronteiras-f0fa9.firebaseapp.com",
  projectId: "ti-sem-fronteiras-f0fa9",
  storageBucket: "ti-sem-fronteiras-f0fa9.appspot.com",
  messagingSenderId: "COLE_AQUI_SEU_SENDER_ID",
  appId: "COLE_AQUI_SEU_APP_ID",
};

const COLECOES = {
  PAISES: "paises",
  VAGAS: "vagas",
  RADAR_TECNOLOGIAS: "radar_tecnologias",
  TRILHAS_QUALIFICACAO: "trilhas_qualificacao",
};

async function carregarColecao(db, nome) {
  try {
    const snap = await getDocs(collection(db, nome));
    const registros = snap.docs.map((doc) => doc.data());
    return registros.length ? registros : null; // vazio -> mantém fallback
  } catch (erro) {
    console.warn(`[Firestore] Falha ao ler a coleção "${nome}":`, erro.message);
    return null;
  }
}

// Promise global que o app.js aguarda antes de renderizar a página.
// SEMPRE resolve (nunca rejeita) — pior caso, os dados locais permanecem.
window.dadosProntos = (async () => {
  const configPreenchida =
    firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("COLE_AQUI");

  if (!configPreenchida) {
    console.info(
      "[Firestore] firebaseConfig ainda não preenchida em firebase-data.js — usando dados locais de demonstração (data.js)."
    );
    return;
  }

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const [paises, vagas, radar, trilhas] = await Promise.all([
      carregarColecao(db, COLECOES.PAISES),
      carregarColecao(db, COLECOES.VAGAS),
      carregarColecao(db, COLECOES.RADAR_TECNOLOGIAS),
      carregarColecao(db, COLECOES.TRILHAS_QUALIFICACAO),
    ]);

    if (paises) window.PAISES = paises;
    if (vagas) window.VAGAS = vagas;
    if (radar) window.RADAR_TECNOLOGIAS = radar;
    if (trilhas) window.TRILHAS_QUALIFICACAO = trilhas;

    const tudoVeioDoFirestore = paises && vagas && radar && trilhas;
    console.info(
      tudoVeioDoFirestore
        ? `[Firestore] Conectado ao mesmo banco do protótipo (${firebaseConfig.projectId}).`
        : "[Firestore] Conectado, mas alguma coleção veio vazia — usando fallback local para ela."
    );
  } catch (erro) {
    console.warn(
      "[Firestore] Não foi possível conectar — usando dados locais de demonstração (data.js).",
      erro
    );
  }
})();
