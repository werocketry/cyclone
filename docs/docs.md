# Docs

Welcome to the docs! Currently we are using Node.js 16.13.0, Chromium 98.0.4758.102, and Electron 17.1.0.

## Development and Testing

The script requires [node.js](https://nodejs.org/) (NOTE: Current scripts require Node.js 18). Once Node.js is installed and Cyclone is downloaded, navigate to the Cyclone directory in a terminal and start by installing the dependencies.

### 1. Install Dependencies

Install both production and development dependencies:

```
npm install canvas
npm install
```

### 2. Build the TypeScript Files

Compile TypeScript files into JavaScript:

```
npm run build
```

### 3. Start the Electron App

Launch the app and open the GUI:

```
npm start
```

This will compile the TypeScript files (if not already compiled) and start the Electron app with the main window.

### 4. Watch for Changes

To automatically rebuild TypeScript files on change:

```
npm run watch

```

### 5. Lint the Code

Run ESLint to check for code style issues:

```
npm run lint

```

### 6. Debugging

To open the developer tools in the Electron app for debugging:

- You can manually trigger the DevTools via mainWindow.webContents.openDevTools() in src/main.ts.
