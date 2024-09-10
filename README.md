# Tabletop React Powered Gadget

The TTRPG is a simple project for demonstrating responsive control of a tabletop robot using a simple web page.

## Getting Started

Dependencies are controlled through NPM and a simple `npm install` will grab everything you need to get started.

## React + TypeScript + Vite

Vite is the project's bundler, and a local dev server can be launched using `npm run dev`. For convenience, this is
a wrapper around the built-in `vite` command which reads settings from `./vite.config.ts`.

Production ready builds use the command `npm run build` and all output is bundled into the `./dist` directory.
This creates a simple static web-page which can be hosted with any old HTTP server (e.g. nginx) or from the
command line using `npm run preview`.

## ESLint

Strictly typed checks are all enabled, both for Typescript and React.

Configuration is read from the `./eslint.config.js` and run using `npm run lint` or `eslint .`
