# Dados dinâmicos do site

Este diretório contém arquivos de dados que são lidos pelo site em tempo de execução.
Atualize os valores aqui para refletir o andamento do projeto **sem precisar mexer em HTML/CSS/JS**.

---

## `castracoes.json`

Dados das castrações realizadas e o cálculo do impacto ampliado (animais potencialmente evitados),
exibidos na página **Resultados** (`resultados.html`).

### Schema

```json
{
  "atualizadoEm": "março de 2026",
  "castracoes": {
    "gataFemea": 1,
    "gatoMacho": 1,
    "cadela":    1,
    "caoMacho":  0
  },
  "microchipagens": 6,
  "multiplicadoresConservadores": {
    "gataFemea": 60,
    "gatoMacho": 30,
    "cadela":    60,
    "caoMacho":  30
  }
}
```

### Campos

| Campo | Tipo | Descrição |
|---|---|---|
| `atualizadoEm` | string | Mês/ano da última atualização. Aparece no texto da seção. |
| `castracoes.gataFemea` | int | Quantidade de **gatas fêmeas** castradas (acumulado). |
| `castracoes.gatoMacho` | int | Quantidade de **gatos machos** castrados (acumulado). |
| `castracoes.cadela` | int | Quantidade de **cadelas fêmeas** castradas (acumulado). |
| `castracoes.caoMacho` | int | Quantidade de **cães machos** castrados (acumulado). |
| `microchipagens` | int | Total de microchips implantados. |
| `multiplicadoresConservadores.*` | int | Estimativa de nascimentos diretos evitados por castração (ver justificativa abaixo). |

### Como o site calcula o impacto ampliado

```
totalEvitados =
    gataFemea × 60
  + gatoMacho × 30
  + cadela    × 60
  + caoMacho  × 30
```

### Justificativa dos multiplicadores

Valores conservadores baseados em bibliografia veterinária e campanhas brasileiras
de controle populacional (CFMV e programas municipais):

- **Fêmea canina (cadela)** — 60 filhotes. Referência: 1–2 ninhadas/ano × ~6 filhotes × 5 anos de vida reprodutiva útil.
- **Fêmea felina (gata)** — 60 filhotes. Referência: 2–3 ninhadas/ano × ~4 filhotes × 5 anos.
- **Machos (gato / cão)** — 30 cada. Contagem **parcial** (metade de uma fêmea) para não duplicar com o impacto já atribuído às fêmeas da população.

Se a ALPA quiser adotar uma premissa diferente (mais conservadora ou mais ampla, incluindo
cascata de gerações), basta ajustar esses números no JSON — o site recalcula automaticamente.

### Fallback

Se o navegador não conseguir carregar o JSON (ex.: abrir o HTML diretamente por `file://`
em alguns navegadores), a página exibe os valores estáticos que estão no HTML como
fallback seguro.
