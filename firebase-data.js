// =====================================================================
// Conecta o site estático ao MESMO banco Firestore usado pelo protótipo
// Streamlit (firestore_data.py / seed_firestore.py) — projeto
// "ti-sem-fronteiras-f0fa9". As 4 coleções lidas aqui são as mesmas que
// o app.py lê, garantindo que site e app mostrem sempre a mesma informação.
//
// IMPORTANTE: os documentos no Firestore usam os nomes de campo do
// protótipo Python (snake_case, ex: "custo_vida_mensal_usd"), diferentes
// dos nomes usados internamente pelo site (camelCase, ex: "custoVida").
// A função normalizarPais/normalizarVaga abaixo faz essa tradução — é o
// único lugar do projeto que precisa conhecer os dois formatos.
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

// -----------------------------------------------------------------
// 2) Bandeiras: o Firestore (schema do protótipo Python) não guarda
//    emoji de bandeira, então mapeamos por nome do país. País novo que
//    não estiver aqui cai no globo 🌐 em vez de quebrar.
// -----------------------------------------------------------------
const BANDEIRAS = {
  "Portugal": "🇵🇹",
  "Alemanha": "🇩🇪",
  "Canadá": "🇨🇦",
  "Irlanda": "🇮🇪",
  "Espanha": "🇪🇸",
  "Emirados Árabes Unidos": "🇦🇪",
};

// -----------------------------------------------------------------
// 3) Normalizadores: schema do Firestore (igual ao data.py) -> schema
//    usado pelo app.js (igual ao data.js). radar_tecnologias e
//    trilhas_qualificacao já usam os mesmos nomes de campo dos dois
//    lados, então não precisam de tradução.
// -----------------------------------------------------------------
function normalizarPais(doc) {
  return {
    pais: doc.pais,
    regiao: doc.regiao,
    demanda: doc.demanda_ti,
    custoVida: doc.custo_vida_mensal_usd,
    salario: doc.salario_medio_ti_usd,
    idioma: doc.idioma,
    visto: doc.visto,
    dificuldadeVisto: doc.dificuldade_visto,
    resumo: doc.resumo,
    bandeira: BANDEIRAS[doc.pais] || "🌐",
  };
}

function normalizarVaga(doc) {
  return {
    titulo: doc.titulo,
    empresa: doc.empresa,
    pais: doc.pais,
    modalidade: doc.modalidade,
    senioridade: doc.senioridade,
    stack: doc.stack,
    salario: doc.salario_faixa_usd,
  };
}

const COLECOES = {
  paises: normalizarPais,
  vagas: normalizarVaga,
  radar_tecnologias: (doc) => doc,
  trilhas_qualificacao: (doc) => doc,
};

async function carregarColecao(db, nome, normalizar) {
  try {
    const snap = await getDocs(collection(db, nome));
    const registros = snap.docs.map((doc) => normalizar(doc.data()));
    return registros.length ? registros : null; // vazio -> mantém fallback
  } catch (erro) {
    console.warn(`[Firestore] Falha ao ler a coleção "${nome}":`, erro.message);
    return null;
  }
}

function marcarFonteDados(modo) {
  const badge = document.getElementById("fonte-dados");
  if (!badge) return;
  badge.hidden = false;
  badge.dataset.modo = modo;
  badge.textContent =
    modo === "firestore"
      ? "🔥 Mesmos dados do app (Firestore)"
      : "📦 Dados locais de demonstração";
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
    marcarFonteDados("local");
    return;
  }

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const [paises, vagas, radar, trilhas] = await Promise.all(
      Object.entries(COLECOES).map(([nome, normalizar]) =>
        carregarColecao(db, nome, normalizar)
      )
    );

    if (paises) window.PAISES = paises;
    if (vagas) window.VAGAS = vagas;
    if (radar) window.RADAR_TECNOLOGIAS = radar;
    if (trilhas) window.TRILHAS_QUALIFICACAO = trilhas;

    const tudoVeioDoFirestore = paises && vagas && radar && trilhas;
    marcarFonteDados(tudoVeioDoFirestore ? "firestore" : "local");
    console.info(
      tudoVeioDoFirestore
        ? `[Firestore] Conectado ao mesmo banco do protótipo (${firebaseConfig.projectId}).`
        : "[Firestore] Conectado, mas alguma coleção veio vazia — usando fallback local para ela."
    );
  } catch (erro) {
    marcarFonteDados("local");
    console.warn(
      "[Firestore] Não foi possível conectar — usando dados locais de demonstração (data.js).",
      erro
    );
  }
})();
