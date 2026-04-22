# Deploy no Firebase Hosting

Guia passo a passo para publicar o site **Impacto Animal** no Firebase Hosting
com domínio customizado `www.impactoanimal.com.br`.

Existem **dois caminhos**:

- [🚀 Caminho A — GitHub + Firebase (recomendado)](#caminho-a--github--firebase-recomendado):
  todo o deploy acontece no GitHub Actions, sem precisar instalar `firebase-tools` local.
- [💻 Caminho B — Deploy local via Firebase CLI](#caminho-b--deploy-local-via-firebase-cli):
  requer `firebase-tools` instalado na sua máquina.

Configuração de **domínio customizado** é a mesma nos dois casos — ver
[Passo final: Domínio customizado](#passo-final--domínio-customizado).

---

## Caminho A — GitHub + Firebase (recomendado)

Fluxo final: todo `git push` para a branch `main` publica o site automaticamente.

### A.1 · Criar o projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com).
2. Clique em **"Adicionar projeto"**.
3. Nome sugerido: `impacto-animal` (ou `alpa-impacto-animal`).
4. **Desabilite** o Google Analytics (opcional para um site institucional).
5. Clique em **"Criar projeto"** e aguarde.
6. Menu lateral → **Build → Hosting → Começar** (pode fechar o tutorial inicial).
7. **Anote o ID do projeto** — aparece no topo da tela e em *Configurações do projeto*
   (exemplo: `impacto-animal-abc123`).

### A.2 · Ajustar `.firebaserc` com o ID do projeto

Abra o arquivo `.firebaserc` na raiz e troque `SEU-PROJECT-ID` pelo ID real:

```json
{
  "projects": {
    "default": "impacto-animal-abc123"
  }
}
```

### A.3 · Criar o repositório no GitHub

1. Acesse [github.com/new](https://github.com/new) e crie um repositório (público ou privado).
   Nome sugerido: `impacto-animal`.
2. **Não** adicione README/gitignore/license pelo GitHub (já tem no projeto).
3. No terminal, na raiz do projeto:

   ```bash
   git init
   git add .
   git commit -m "feat: site institucional Impacto Animal"
   git branch -M main
   git remote add origin https://github.com/<seu-usuario>/impacto-animal.git
   git push -u origin main
   ```

   > Se `https` falhar por certificado, use SSH: `git remote add origin git@github.com:<seu-usuario>/impacto-animal.git`.

### A.4 · Gerar a chave de serviço do Firebase

Esta chave permite que o GitHub Actions autentique no Firebase em seu nome.

1. No [Firebase Console](https://console.firebase.google.com), abra seu projeto.
2. ⚙️ **Configurações do projeto** (engrenagem no topo da barra lateral).
3. Aba **"Contas de serviço"** → clique em **"Gerar nova chave privada"**.
4. Confirme — um arquivo `.json` é baixado. **Guarde em local seguro** e nunca faça
   commit dele.

### A.5 · Configurar secrets no GitHub

No GitHub, na página do seu repositório:

1. **Settings → Secrets and variables → Actions**.

2. Aba **"Secrets"** → **"New repository secret"**:
   - **Name:** `FIREBASE_SERVICE_ACCOUNT`
   - **Secret:** abra o JSON baixado no passo anterior, copie **todo** o conteúdo
     e cole aqui.

3. Aba **"Variables"** → **"New repository variable"**:
   - **Name:** `FIREBASE_PROJECT_ID`
   - **Value:** o ID do projeto Firebase (mesmo do `.firebaserc`, ex.: `impacto-animal-abc123`).

### A.6 · Ativar o deploy

Commit o arquivo `.firebaserc` atualizado e dê push:

```bash
git add .firebaserc
git commit -m "chore: configurar project id do Firebase"
git push
```

Acompanhe o deploy em **GitHub → aba Actions**. Em ~1 minuto, o site estará no ar.

URL inicial:

```
https://<project-id>.web.app
https://<project-id>.firebaseapp.com
```

### A.7 · Atualizações futuras

Qualquer `git push` na branch `main` publica automaticamente. Por exemplo,
quando atualizar `data/castracoes.json` com novos resultados:

```bash
git add data/castracoes.json
git commit -m "chore: atualizar resultados de abril/2026"
git push
```

O GitHub Actions cuida do resto.

---

## Caminho B — Deploy local via Firebase CLI

Só use este caminho se quiser publicar direto da sua máquina, sem GitHub.
Requer `firebase-tools` instalado (o que pode esbarrar em proxy SSL
corporativo — ver alternativas em [Troubleshooting](#troubleshooting)).

```bash
# 1. Instalar a CLI (uma vez só)
npm install -g firebase-tools
# ou, se tiver problema de SSL com npm:
curl -sL https://firebase.tools | bash

# 2. Autenticar
firebase login

# 3. Associar ao projeto (já existe .firebaserc, mas refirme)
firebase use --add

# 4. Publicar
firebase deploy --only hosting
```

---

## Passo final — Domínio customizado

Independentemente do caminho (A ou B), o domínio é configurado pelo Firebase Console:

1. **Firebase Console → Hosting → Domínios personalizados**.
2. **Adicionar domínio personalizado** → `www.impactoanimal.com.br` → **Continuar**.
3. O Firebase mostra os registros DNS a configurar no Registro.br (ou provedor de DNS):

   | Tipo | Nome/Host | Valor (o Firebase fornece os corretos) |
   |---|---|---|
   | TXT | `@` ou `www` | `google-site-verification=…` |
   | A   | `www` | `151.101.1.195` |
   | A   | `www` | `151.101.65.195` |

4. Adicione também o domínio raiz `impactoanimal.com.br`, configurando
   **redirect para www** (o Firebase oferece essa opção direto no painel).

5. Propagação de DNS leva de alguns minutos a 48h. O Firebase provisiona SSL
   automaticamente (Let's Encrypt) assim que o DNS propagar.

### Onde alterar o DNS

- **Registro.br:** painel → domínio → DNS → "Editar zona".
- **Outros provedores (GoDaddy, HostGator etc.):** procure por
  "Gerenciar DNS" / "Zone Editor".

---

## O que o `firebase.json` já entrega

O arquivo `firebase.json` do projeto está pré-configurado com:

- **`cleanUrls: true`** → URL `/resultados` serve `resultados.html` sem o sufixo.
- **Cache inteligente por tipo de arquivo:**
  - Imagens: 1 ano (`immutable`) — aproveita CDN ao máximo.
  - CSS/JS: 1 hora com revalidação — mudanças chegam rápido.
  - **`data/castracoes.json`:** 5 minutos — atualização de resultados quase em tempo real.
  - HTML: sempre revalidado — novas seções aparecem imediatamente.
- **Headers de segurança:** `X-Content-Type-Options`, `Referrer-Policy`.

---

## Troubleshooting

| Problema | Solução |
|---|---|
| `npm install -g firebase-tools` falha com `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` | Rede corporativa com inspeção SSL. Use o **Caminho A** (não depende da CLI local) ou o instalador standalone: `curl -sL https://firebase.tools \| bash`. |
| GitHub Action falha em "Deploy para Firebase Hosting" com erro de auth | Cheque o secret `FIREBASE_SERVICE_ACCOUNT` — copiou o JSON **inteiro**? E a variável `FIREBASE_PROJECT_ID` bate com o projeto real? |
| Action OK mas o site não aparece | Confirme no Firebase Console → Hosting qual foi o último release. Em caso de erro, o log da Action tem a mensagem específica. |
| Formulário de contato não envia após deploy | O Formspree funciona em qualquer domínio. Cheque o endpoint em `index.html` (`action="https://formspree.io/f/..."`) e se o endereço no painel Formspree está ativo. |
| `data/castracoes.json` retorna 404 | Confirme que o arquivo está no commit (`git ls-files data/`). Cache do navegador pode estar servindo versão antiga — teste em aba anônima. |
| SSL do domínio customizado demorando | Normal levar algumas horas após o DNS propagar. Acompanhe o status na aba "Domínios personalizados" do Firebase. |
