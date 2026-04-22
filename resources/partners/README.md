# Logos de parceiros

Coloque aqui os arquivos de logo das empresas parceiras (Patronos e Benfeitores).

## Recomendações técnicas

- **Formato**: PNG com fundo transparente ou SVG
- **Resolução**: mínimo 400x225 px (proporção 16:9) ou quadrado
- **Peso**: idealmente abaixo de 100 KB por arquivo
- **Nomenclatura**: `nome-da-empresa.png` ou `nome-da-empresa.svg` (sem acentos, minúsculas, hífens no lugar de espaços)

## Como adicionar ao site

No arquivo `index.html`, localize a seção `<!-- Parceiros -->` e substitua os `<span class="partner-placeholder">` pelos `<img>`:

```html
<li class="partner">
    <img src="resources/partners/nome-da-empresa.png" alt="Nome da Empresa">
</li>
```

O CSS já aplica um efeito elegante de **grayscale** nas logos, que ganham cor ao passar o mouse. Isso dá uniformidade visual à seção mesmo com logos de cores e estilos variados.

## Observações

- Para empresas **Patronas**, a logo aparece no card padrão.
- Para empresas **Benfeitoras**, você pode adicionar a classe `partner-featured` para destacar (exemplo para implementação futura).
