# Pulsar

### This is a desktop app using the following technologies.

#### Tools:

- Desktop framework: Tauri
- Bundler: Vite
- Package manager: yarn

#### Front-End:

- UI framework: Preact
- Language: TypeScript
- State manager: Effector
- Styles: CSS modules & Sass
- UI library: Headless UI
- Architecture: Feature Sliced Design
- Database: WatermelonDB

#### Back-End:

- Language: Rust

## Requirements

See [Tauri's prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites/) for platform-specific requirements.

## Corepack

Project is using yarn v4. You don't need to install anything but you do need to enable corepack. Before running any other command run:

```bash
corepack enable
```

Corepack is a nodejs module that enables to use other package managers (pnpm, yarn) without the need to install them

## Start the app

```bash
yarn
yarn start
```

## Testing

```bash
bun test
```

## Commits

Please, use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) for naming your commits

type(where): action description

example:

feat(chat): add initial screen

See more examples in commits history.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

