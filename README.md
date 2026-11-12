# React + Vite

## Backend do Gemini

O backend lê `GEMINI_API_KEY` de `Backend/.env`. A chave fica somente no servidor e não deve ser adicionada ao Git. Para configurar uma cópia nova, use `Backend/.env.example` como referência e preencha a chave do Google AI Studio.

Inicie o backend e o frontend em terminais separados, na raiz do projeto:

```sh
npm run dev:backend
npm run dev
```

O formulário envia objetivo, peso, altura, idade, sexo e dias de treino ao endpoint `POST /api/gerar-treino`. O backend chama o Gemini e devolve uma lista de exercícios em JSON com nome, séries, repetições e observação opcional.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
