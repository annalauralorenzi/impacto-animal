# Impacto Animal – ALPA

Site institucional do projeto **Impacto Animal**, uma iniciativa da **Associação Lageana de Proteção aos Animais (ALPA)** que conecta empresas ao propósito de reduzir o abandono animal em Lages/SC, financiando castração, microchipagem e feiras de adoção.

> **Empresas que cuidam de vidas, inspiram o futuro.**

---

## Estrutura do projeto

```
impacto-animal/
├── index.html     # Estrutura e conteúdo do site
├── styles.css     # Design system, layout e responsividade
├── script.js      # Interatividade (menu, animações, form)
└── README.md      # Este arquivo
```

Site estático, sem dependências ou processo de build. Pode ser hospedado em qualquer servidor HTTP estático (Netlify, Vercel, GitHub Pages, Hostgator, Apache, Nginx etc.).

---

## Seções

1. **Hero** – Chamada principal com CTA e estatísticas de impacto.
2. **O Projeto** – Descrição da causa e dos serviços financiados.
3. **Pilares** – *Apoio · Ação · Prestígio*, os três eixos do projeto.
4. **Como Participar** – Passo a passo para a empresa aderir.
5. **Selo Empresa Amiga dos Animais** – Reconhecimento após 12 meses.
6. **Contato** – Formulário e canais de atendimento.
7. **Footer** – Links, redes sociais e informações institucionais.

---

## Como executar localmente

Basta abrir o `index.html` no navegador. Para testar em servidor local:

```bash
# Python 3
python3 -m http.server 8000

# Node (http-server)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Acesse: [http://localhost:8000](http://localhost:8000)

---

## Personalização

### Cores (design tokens em `styles.css`)

| Variável | Valor | Uso |
|---|---|---|
| `--color-primary` | `#E76F51` | Terracota – cor de destaque principal |
| `--color-secondary` | `#2A9D8F` | Verde-água – confiança e natureza |
| `--color-accent` | `#F4A261` | Laranja-areia – acentos e detalhes |
| `--color-dark` | `#264653` | Azul profundo – textos e fundos escuros |
| `--color-cream` | `#FDF9F0` | Creme – fundos suaves |

### Tipografia

- **Display** (títulos): [Inter](https://fonts.google.com/specimen/Inter)
- **Corpo**: [Poppins](https://fonts.google.com/specimen/Poppins)

Ambas carregadas via Google Fonts.

### Formulário de contato

O envio do formulário atualmente é simulado. Para integrar com um serviço real, edite o handler em `script.js` (`form.addEventListener('submit', …)`) e envie os dados para sua API (`fetch(endpoint, { method: 'POST', body: … })`), ou use serviços como:

- [Formspree](https://formspree.io/)
- [Getform](https://getform.io/)
- [Web3Forms](https://web3forms.com/)

### Imagens

A imagem de fundo do hero usa Unsplash via URL. Para trocar por uma imagem própria, ajuste o `background` da classe `.hero` em `styles.css` para apontar para o arquivo local (ex.: `url('assets/hero.jpg')`).

### Contato e redes sociais

Atualize os dados reais em `index.html`:

- E-mail: `impactoanimal@alpalages.com.br`
- WhatsApp: `https://wa.me/5549991885561`
- Instagram / Facebook / LinkedIn: trocar `href="#"` pelos links oficiais.

---

## Deploy

O projeto está configurado para **Firebase Hosting** (arquivos `firebase.json`
e instruções detalhadas em [`DEPLOY.md`](./DEPLOY.md)).

### Resumo rápido

```bash
# 1. Instalar a CLI (uma vez só)
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Associar ao projeto Firebase (escolher alias "default")
firebase use --add

# 4. Publicar
firebase deploy --only hosting
```

Para o passo a passo completo, incluindo configuração do domínio customizado
`www.impactoanimal.com.br` e auto-deploy via GitHub Actions, veja
[**DEPLOY.md**](./DEPLOY.md).

### Alternativas

O site é 100% estático, então qualquer hospedagem serve:

- **Netlify / Vercel** — arrastar a pasta no dashboard.
- **GitHub Pages** — `git push` para uma branch `main` e habilitar em *Settings → Pages*.
- **HostGator, Locaweb, cPanel** — upload via FTP da pasta inteira.

---

## Acessibilidade e SEO

- HTML semântico (`<header>`, `<section>`, `<article>`, `<footer>`).
- Metatags Open Graph e descrição.
- Labels em formulários e `aria-label` em ícones/botões.
- Contraste de cores respeitando WCAG AA.
- `prefers-reduced-motion` respeitado para animações.

---

## Licença

Todos os direitos reservados à **Associação Lageana de Proteção aos Animais – ALPA**.
