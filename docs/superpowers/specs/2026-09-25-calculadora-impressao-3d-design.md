# Calculadora de Precificação de Impressão 3D — Design Spec

**Data:** 2026-09-25  
**Branch:** `feat/calculadora-impressao-3d`  
**Status:** aprovado em brainstorming (abordagem 1, progressive disclosure A, arredondamento D)  
**Contexto de uso:** ferramenta pública do hub + demo no próximo vídeo do YouTube

---

## 1. Objetivo

Permitir que quem imprime em 3D (iniciante ou profissional) informe custos de produção e receba, em tempo real:

- custo de material, energia, máquina, mão de obra, adicionais e perdas;
- custo total e custo real por unidade;
- preço mínimo (custo), preço recomendado e preço arredondado;
- faturamento, lucro estimado, margem efetiva e markup.

Mensagem central da ferramenta:

> O preço de uma impressão 3D não deve considerar apenas o filamento.

Prioridades: simplicidade → clareza → cálculos corretos → mobile → manutenção.

Fora de escopo: login, PDF, multi-moeda, multi-filamento, URL shareable, ERP, biblioteca de gráficos.

---

## 2. Contexto do projeto

| Item | Valor |
|------|--------|
| Framework | Next.js 16 (App Router) + React 19 |
| Estilo | Tailwind CSS 4 + CSS variables em `globals.css` |
| Idioma | `pt_BR` |
| Design system | tokens dark do Daniel From Zero (sobrescreve VibeUX em conflitos) |
| Componentes existentes | `Button`, `Card`, `Section`, `Navbar`, `Footer`, `SpiralMotif` |
| Testes | nenhum runner instalado — **não** adicionar infraestrutura só por essa página |
| Hub atual | `/ferramentas` já anuncia a calculadora como “próxima” |

---

## 3. Arquitetura

### Abordagem escolhida

Página única com **shell RSC** (SEO + conteúdo educativo) + **client component** da calculadora. Lógica financeira em funções puras tipadas, separada da UI.

### Rota

`/ferramentas/calculadora-impressao-3d`

### Arquivos previstos

```text
app/ferramentas/calculadora-impressao-3d/page.tsx
lib/pricing.ts
lib/format.ts
components/pricing-calculator/
  PricingCalculator.tsx
  ProductionSection.tsx
  FilamentSection.tsx
  PrinterSection.tsx
  LaborSection.tsx
  MarginSection.tsx
  AdvancedSettings.tsx
  AdditionalCostsList.tsx
  PricingSummary.tsx
  HelpTooltip.tsx
  Field.tsx
```

### Integração no hub

- `/ferramentas`: card da calculadora vira link real (tag `gratuita`, sem “em breve”).
- Home: card Ferramentas deixa de ser só “em breve”; texto aponta a calculadora no ar.

### Estado e persistência

- Um objeto `PricingInput` no client.
- Recalcula a cada mudança via `calculatePricing(input)` — sem botão “Calcular”.
- Hidrata de `localStorage` após mount (chave versionada, ex.: `dfz-pricing-v1`) para evitar mismatch SSR.
- Botão **Limpar calculadora**: reset aos defaults + remove dados salvos.

---

## 4. Layout e UX

### Desktop (max-width 1200px)

- Coluna esquerda: formulário em cards de seção.
- Coluna direita: resumo sticky.
- Cabeçalho + nota + botão/chip de preset acima do grid.

### Mobile

- Formulário primeiro; resultado abaixo; sem sticky.

### Progressive disclosure (opção A)

**Sempre visível**

1. Produção (quantidade, tempo total h/min)
2. Filamento (preço do rolo, peso, uso + custo estimado ao vivo)
3. Impressora (watts, R$/kWh) — sem custo máquina/h
4. Mão de obra (tempo manual h/min, valor da hora)
5. Margem desejada

**Dentro de “Configurações avançadas” (colapsado por padrão)**

- Custo da máquina por hora
- Custos adicionais (lista dinâmica)
- Perdas / desperdício (%)
- Impostos, taxa marketplace, taxa pagamento

### Cabeçalho

- Título: Calculadora de Preço para Impressão 3D
- Descrição: custos reais + preço sustentável (material, máquina, mão de obra, perdas, impostos, lucro)
- Nota: não precisa preencher tudo

### Microcopy e ensino

- Tooltips `?` em conceitos (máquina/h, margem vs markup, desperdício, energia, etc.)
- Distinção explícita: tempo da impressora ≠ tempo de trabalho
- Tom do canal: direto, sem vocabulário de guru
- Preset **Perfil iniciante**: perdas 10%, máquina R$ 1,50/h, margem 40% — não altera filamento, energia nem mão de obra

### Visual (design system)

- Tokens existentes; números/resultados em `--font-mono`; preço principal em `--color-accent`
- Cards só como containers de seção/resumo (padrão do produto)
- Barras de composição de custo em CSS puro (sem lib de chart)
- Motion esparsa; respeitar `prefers-reduced-motion`

---

## 5. Modelo de dados

```ts
type AdditionalCost = {
  id: string
  name: string
  value: number
  type: "unit" | "total"
}

type PricingInput = {
  quantity: number
  filament: {
    spoolPrice: number
    spoolWeight: number
    usedWeight: number
  }
  printing: {
    hours: number
    minutes: number
    averageWatts: number
    electricityPrice: number
    machineHourlyCost: number
  }
  labor: {
    hours: number
    minutes: number
    hourlyRate: number
  }
  wastePercentage: number
  fees: {
    tax: number
    marketplace: number
    payment: number
  }
  desiredMargin: number
  additionalCosts: AdditionalCost[]
}
```

Campos opcionais vazios tratam-se como `0`.

### Defaults

| Campo | Default |
|-------|---------|
| Quantidade | 1 |
| Peso do rolo | 1000 g |
| Perdas | 10% |
| Margem | 40% |
| Impostos / marketplace / pagamento | 0% |
| Demais numéricos | 0 |

---

## 6. Fórmulas

```text
tempo_horas = hours + minutes / 60
custo_filamento = (spoolPrice / spoolWeight) * usedWeight   // se spoolWeight > 0
custo_energia = (watts / 1000) * tempo_horas * electricityPrice
custo_maquina = tempo_horas * machineHourlyCost
custo_mao_de_obra = tempo_manual_horas * hourlyRate
custo_adicionais = Σ (type === "unit" ? value * quantity : value)

subtotal = filamento + energia + máquina + mão de obra + adicionais
custo_com_perdas = subtotal * (1 + wastePercentage/100)
custo_total = custo_com_perdas

taxas = (tax + marketplace + payment) / 100
margem = desiredMargin / 100

SE margem + taxas >= 1 → erro, sem preço de venda
SENÃO:
  preco_total = custo_total / (1 - margem - taxas)
  preco_unitario = preco_total / quantity
  custo_unitario = custo_total / quantity
```

**Não** usar `custo * (1 + margem)` como preço recomendado (isso é markup, não margem).

### Lucro e indicadores

```text
faturamento = preco_unitario * quantity   // ou preco_total
taxas_em_reais = faturamento * taxas
lucro = faturamento - custo_total - taxas_em_reais
margem_efetiva = lucro / faturamento      // se faturamento > 0
markup = preco_total / custo_total        // exibir como "1,67x"
```

### Arredondamento comercial (opção D)

Preço unitário arredondado **sempre para cima** no step:

| Faixa do preço unitário | Step |
|-------------------------|------|
| &lt; R$ 20 | R$ 0,10 |
| ≥ R$ 20 e &lt; R$ 100 | R$ 0,50 |
| ≥ R$ 100 | R$ 1,00 |

O usuário continua vendo o preço calculado exato; o arredondado é sugestão comercial.

### Formatação

`Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })` para moeda; percentuais e tempos em padrão brasileiro (`40%`, `3h 25min`, `250 g`).

---

## 7. Validação

Bloquear / avisar:

- quantidade &lt; 1
- valores negativos
- percentuais negativos
- peso do rolo = 0 (impede divisão)
- margem + taxas ≥ 100% — mensagem: *A soma da margem desejada e das taxas precisa ser menor que 100%.*

---

## 8. UI do resultado (sticky)

Card principal:

- **Preço recomendado** por unidade (accent + mono)
- Total do pedido

Três referências:

1. **Custo real** — cobre só os custos estimados
2. **Preço recomendado** — custos + taxas + margem
3. **Preço arredondado sugerido** — lógica D

Breakdown tabular (filamento, energia, máquina, mão de obra, adicionais → subtotal → perdas → custo total).

Barras CSS de composição (Material, Energia, Máquina, Mão de obra, Outros).

Indicadores: faturamento, lucro, margem efetiva, markup (com tooltip).

Ações: **Copiar resumo** (clipboard) e **Limpar calculadora**.

Texto do resumo copiado (exemplo):

```text
Precificação da impressão 3D

Quantidade: 50 unidades
Custo total: R$ 256,96
Custo por unidade: R$ 5,14
Preço sugerido: R$ 8,57/un
Total do pedido: R$ 428,27
Margem: 40%
```

---

## 9. Benchmark de validação

Input do brief (50 peças, rolo R$ 100 / 1000 g / 1000 g usados, 30 h, 120 W, R$ 1/kWh, máquina R$ 1,50/h, mão de obra 2 h × R$ 30, adicional R$ 0,50/un, perdas 10%, taxas 0%, margem 40%).

Resultados esperados (aprox.):

| Item | Valor |
|------|-------|
| Filamento | R$ 100,00 |
| Energia | R$ 3,60 |
| Máquina | R$ 45,00 |
| Mão de obra | R$ 60,00 |
| Adicionais | R$ 25,00 |
| Subtotal | R$ 233,60 |
| Com perdas 10% | R$ 256,96 |
| Preço total (40% margem) | R$ 428,27 |
| Preço / un | ~ R$ 8,57 |

---

## 10. SEO e conteúdo educativo

**Title:** Calculadora de Preço de Impressão 3D \| Quanto cobrar por uma impressão 3D  

**Description:** Calcule quanto cobrar pelas suas impressões 3D considerando filamento, energia, tempo da impressora, mão de obra, impostos, perdas e margem de lucro.

Abaixo da calculadora (RSC), três tópicos curtos:

1. Como calcular o preço de uma impressão 3D?
2. Filamento não é o único custo
3. Qual margem usar em impressão 3D? (sem afirmar margem “certa”)

---

## 11. Acessibilidade

- Labels associados aos inputs
- Navegação por teclado; `:focus-visible` em accent
- Tooltips acessíveis (teclado + `aria`)
- `inputMode` adequado no mobile (`numeric` / `decimal`)
- Contraste AA com a paleta existente

---

## 12. Testes

Sem runner no projeto: validação manual do benchmark + TypeScript/lint limpos. Funções em `lib/pricing.ts` devem ser puras e fáceis de testar se um runner for adicionado depois.

---

## 13. Critérios de pronto

1. Fórmulas batem o benchmark (~R$ 8,57/un)
2. Layout desktop 2 colunas + sticky; mobile empilhado
3. Avançado colapsado por padrão; preset iniciante funciona
4. localStorage + Limpar
5. Copiar resumo
6. Hub e home atualizados
7. SEO metadata + bloco educativo
8. Formatação BRL; validação de margem+taxas
9. `tsc` / lint sem erros; sem código morto
