# Versionamento — SUALE

Toda alteração que vira commit **precisa** carregar um número de versão, para que
qualquer pessoa (ou agente) saiba exatamente qual build está rodando.

## Versão atual

**1.1.0** — 2026-07-28

## Onde a versão vive

São **três lugares** e eles sobem **juntos, no mesmo commit**:

| # | Local | O que é |
|---|-------|---------|
| 1 | `prototype/app.js` → `const APP_VERSION` | Fonte da verdade. É o que aparece na tela. |
| 2 | `package.json` → `"version"` | Espelho, para tooling npm. |
| 3 | Tag do git → `v1.1.0` | Marca o commit exato daquela versão. |

O protótipo é HTML/JS estático, sem build step — por isso o `package.json` não
consegue injetar a versão no browser e o `APP_VERSION` precisa existir separado.
Se os três divergirem, **o `app.js` é quem manda**, porque é o que o usuário vê.

## Onde aparece na tela

- **Tela de login** — rodapé, com data do build: `SUALE v1.1.0 · 2026-07-28`
- **Sidebar** — abaixo de "Sair do Sistema": `SUALE v1.1.0`

Ambos são preenchidos por `renderVersionTags()`, que procura elementos com o
atributo `data-app-version`. Para exibir a versão em qualquer lugar novo, basta:

```html
<span data-app-version="short">v—</span>   <!-- v1.1.0 -->
<span data-app-version="full">v—</span>    <!-- v1.1.0 · 2026-07-28 -->
```

## Como escolher o número (semver)

| Parte | Quando subir | Exemplo |
|-------|--------------|---------|
| **MAJOR** (`2.0.0`) | Quebra fluxo ou formato de dados salvos. Ex.: mudar o schema do `SharedState` de um jeito que invalida o `localStorage` de quem já usa. | Trocar a chave `saged_shared_state_v2` |
| **MINOR** (`1.2.0`) | Nova tela, novo perfil, nova funcionalidade — sem quebrar o que existe. | Adicionar Restrições Alimentares |
| **PATCH** (`1.1.1`) | Correção de bug, ajuste de texto, refactor sem mudança visível. | Consertar o `fichasSalvas` undefined |

## Passo a passo ao commitar

```bash
# 1. edite APP_VERSION em prototype/app.js e "version" em package.json
# 2. commit normal
git add -A && git commit -m "feat: ..."
# 3. crie a tag apontando para esse commit
git tag -a v1.2.0 -m "v1.2.0 — resumo curto do que mudou"
```

Para conferir em que versão você está:

```bash
git describe --tags
```

## Histórico

| Versão | Data | Commit | O que entrou |
|--------|------|--------|--------------|
| 1.1.0 | 2026-07-28 | `84d2fde`, `d73e84c` | RBAC do login consertado (perfis Diretor/Merendeira/Resp. Estoque eram inalcançáveis), restrições alimentares, sidebar em grupos colapsáveis, Sprint ABC completa no menu, remoção do campo morto de Gemini API Key |
| 1.0.0 | — | `4bd44cd` | Protótipo inicial |

> **Nota para o Antigravity:** esta convenção passou a valer em 2026-07-28. Commits
> anteriores não têm tag. Ao commitar, suba os três lugares — se só um subir, a tela
> passa a mentir sobre qual build está no ar.
