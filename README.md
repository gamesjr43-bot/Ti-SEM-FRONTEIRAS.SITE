# TI Sem Fronteiras — Site estático (GitHub Pages)

Versão 100% estática (HTML + CSS + JavaScript puro, sem build, sem
dependências externas) do protótipo TI Sem Fronteiras, pronta para
hospedar no **GitHub Pages**.

## Estrutura

- `index.html` — página única com as 3 seções (Início, MundoDev, GlobalIT Jobs),
  navegadas via âncora (`#inicio`, `#mundodev`, `#globalit`).
- `styles.css` — identidade visual (cores, tipografia Fraunces + IBM Plex Sans).
- `data.js` — dados de demonstração (países, vagas, tecnologias, trilhas).
- `app.js` — toda a lógica: navegação, filtros, gráficos de barra e accordion.

Não tem backend, não tem build step — é só abrir `index.html` no navegador
ou publicar os arquivos como estão.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex: `ti-sem-fronteiras`) e suba estes 4 arquivos
   (`index.html`, `styles.css`, `data.js`, `app.js`) na raiz do repositório.

   ```bash
   git init
   git add index.html styles.css data.js app.js README.md
   git commit -m "Site estático TI Sem Fronteiras"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/ti-sem-fronteiras.git
   git push -u origin main
   ```

2. No GitHub, vá em **Settings → Pages** do repositório.
3. Em **"Build and deployment" → Source**, selecione **"Deploy from a branch"**.
4. Em **Branch**, escolha `main` e a pasta `/ (root)` → **Save**.
5. Em 1–2 minutos, o link fica disponível em:
   `https://SEU-USUARIO.github.io/ti-sem-fronteiras/`

## Testar localmente antes de publicar

Como o navegador bloqueia alguns recursos ao abrir `index.html` direto
como arquivo (`file://`), rode um servidor local simples:

```bash
python3 -m http.server 8000
```

E acesse `http://localhost:8000` no navegador.

## Conectado ao mesmo Firestore do protótipo

O site agora lê as mesmas 4 coleções do protótipo Streamlit
(`paises`, `vagas`, `radar_tecnologias`, `trilhas_qualificacao`) no projeto
Firebase `ti-sem-fronteiras-f0fa9`, via `firebase-data.js` (SDK Web
modular, carregado do CDN oficial do Firebase). Se a conexão falhar ou a
config não estiver preenchida, o site cai automaticamente para os dados
locais de `data.js` — o mesmo padrão de fallback do protótipo.

### Passo a passo para ativar

1. **Criar um app Web no MESMO projeto Firebase do protótipo**
   No [Console Firebase](https://console.firebase.google.com) → abra o
   projeto `ti-sem-fronteiras-f0fa9` → ⚙️ **Configurações do projeto** →
   aba **Geral** → seção **Seus apps** → clique em **Adicionar app → Web**
   (ícone `</>`) → dê um nome (ex: `site`) → **não** marque Firebase
   Hosting → **Registrar app**. A tela seguinte mostra um objeto
   `firebaseConfig`.

2. **Colar a config em `firebase-data.js`**
   Copie `apiKey`, `authDomain`, `storageBucket`, `messagingSenderId` e
   `appId` para o objeto `firebaseConfig` no topo de `firebase-data.js`
   (o `projectId` já está preenchido).

3. **Publicar as regras de segurança**
   Use o arquivo `firestore.rules` deste pacote (libera leitura pública
   das 4 coleções, mantém escrita bloqueada — só o protótipo, via Admin
   SDK, escreve). No Console: **Firestore Database → Regras**, cole o
   conteúdo e publique. Ou via CLI: `firebase deploy --only firestore:rules`.

4. **Testar**
   Rode `python3 -m http.server 8000`, abra `http://localhost:8000` e
   confira o console do navegador: deve aparecer
   `[Firestore] Conectado ao mesmo banco do protótipo (...)`. Se algo
   estiver errado, o console mostra um aviso e o site continua
   funcionando com os dados locais.

## Próximos passos possíveis

- Adicionar um `manifest.json` e um `service worker` para transformar em PWA
  instalável (como já existe na versão mais avançada do projeto).
