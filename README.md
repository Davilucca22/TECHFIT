# TECHFIT

Aplicação de front-end em React para criar e acompanhar uma rotina pessoal de
treinos de musculação. A interface foi pensada primeiro para celulares e usa
Tailwind CSS, com tema escuro e detalhes em rosa.

## Executar localmente

Requer Node.js 18 ou superior.

```sh
npm install
npm run dev
```

Para validar a versão de produção, execute `npm run build`.

## Funcionalidades

- Definição do objetivo, peso atual e dias de treino.
- Geração aleatória de uma divisão semanal e troca de exercícios.
- Início, marcação e conclusão de treinos; histórico e indicadores de atividade.
- Modal de exercício com GIF de demonstração e instruções em português.
- Perfil, plano e histórico salvos no `localStorage` do navegador.

## Dados externos

O catálogo público [Free Exercise DB](https://github.com/yuhonas/free-exercise-db)
é consultado no navegador para complementar os exercícios com imagens e grupos
musculares; o catálogo é distribuído sob a licença
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Os GIFs de demonstração são carregados do
[FitnessProgramer](https://fitnessprogramer.com/). Ambos requerem conexão com a
internet; se o catálogo não estiver acessível, o plano continua funcionando
com a biblioteca incluída na aplicação.

Este projeto não tem backend nem busca dados nutricionais: o escopo inicial é
somente a gestão de treinos.

## Arquitetura

- `src/pages`: telas de configuração, início, treinos e progresso.
- `src/components`: navegação, botões e componentes reutilizáveis de exercício.
- `src/hooks`: estado persistido, ciclo de vida do catálogo e notificações.
- `src/services`: comunicação e normalização dos dados da API de exercícios.
- `src/domain` e `src/data`: regras de treino, datas, grupos musculares e catálogo local.
- `src/styles/global.css`: entrada Tailwind, tokens de cores e estilos compartilhados.

As cores da identidade visual são definidas como variáveis CSS globais e
expostas ao Tailwind em `tailwind.config.js`. Os componentes compartilhados
usam utilitários Tailwind e `@apply`; as regras restantes no CSS global ficam
restritas aos detalhes visuais e aos breakpoints da interface.