# Docs

Welcome to the docs! Currently we are using Node.js 20.18.1, Chromium 130.0.6723.170, and Electron 39.2.2.

## Development and Testing

The script requires [node.js](https://nodejs.org/). Once Node.js is installed and Cyclone is downloaded, navigate to the Cyclone directory in a terminal and start by installing the dependencies.

### 1. Install Dependencies

Install both production and development dependencies:

```sh
npm install canvas
npm install
```

### 2. Build the TypeScript Files

Compile TypeScript files into JavaScript:

```sh
npm run build
```

### 3. Start the Electron App

Launch the app and open the GUI:

```sh
npm start
```

This will compile the TypeScript files (if not already compiled) and start the Electron app with the main window.

### 4. Watch for Changes

To automatically rebuild TypeScript files on change:

```sh
npm run watch

```

### 5. Lint the Code

Run ESLint to check for code style issues:

```sh
npm run lint

```

### 6. Debugging

To open the developer tools in the Electron app for debugging:

- You can manually trigger the DevTools via mainWindow.webContents.openDevTools() in src/main.ts.

## Packaging Artifacts

Cyclone ships two packaging targets:

- **Electron installers** – run `npm run package:electron -- --win` (or `--mac`, `--linux`) after `npm run build`. Installers are written to the `release/` directory.
- **CLI tarball** – run `npm run package:cli` to generate an npm-compatible archive (the command automatically builds before packing via the `prepack` script).

Continuous packaging happens through `.github/workflows/build.yml`, which runs on pushes/PRs to `main` and uploads both installer bundles and the CLI tarball as workflow artifacts.
