import { app, BrowserWindow, ipcMain, dialog } from "electron";
import * as path from "path";
import { promises as fsPromises } from 'fs';
import { createWriteStream } from 'fs';
import { MarlinPort } from "./marlin-port";
import { planWind } from "./planner";
import { plotGCode } from "./plotter";

type DialogFilter = {
  name: string;
  extensions: string[];
};

type SanitizedDialogOptions = {
  title?: string;
  defaultPath?: string;
  filters?: DialogFilter[];
};

// Function to create the window
function createWindow() {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  // Avoid auto-opening DevTools unless the developer explicitly opts in.
  if (process.env.CYCLONE_DEVTOOLS === "true") {
    mainWindow.webContents.openDevTools();
  }
}

const normalizeFilters = (filters?: DialogFilter[]) => {
  if (!filters) {
    return undefined;
  }

  return filters
    .filter((filter): filter is DialogFilter => {
      return Boolean(filter && Array.isArray(filter.extensions));
    })
    .map((filter) => ({
      name: filter.name,
      extensions: filter.extensions
        .map((ext) => ext.replace(/^\./, ""))
        .filter((ext) => ext.length > 0),
    }))
    .filter((filter) => filter.extensions.length > 0);
};

ipcMain.handle("dialog:openFile", async (_, options: SanitizedDialogOptions = {}) => {
  const result = await dialog.showOpenDialog({
    title: options.title,
    defaultPath: options.defaultPath,
    filters: normalizeFilters(options.filters),
    properties: ["openFile"],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
});

ipcMain.handle("dialog:saveFile", async (_, options: SanitizedDialogOptions = {}) => {
  const result = await dialog.showSaveDialog({
    title: options.title,
    defaultPath: options.defaultPath,
    filters: normalizeFilters(options.filters),
  });

  if (result.canceled || !result.filePath) {
    return null;
  }

  return result.filePath;
});

// Electron ready event
app.on("ready", () => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Window-all-closed event to quit app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle("plan", async (_, { windFilePath, outputFilePath }) => {
  try {
    console.log("IPC Plan call - Wind File Path:", windFilePath);
    console.log("IPC Plan call - Output File Path:", outputFilePath);

    // Read the wind file using the full path
    const windData = JSON.parse(await fsPromises.readFile(windFilePath, "utf8"));
    const gcode = planWind(windData, false);
    await fsPromises.writeFile(outputFilePath, gcode.join("\n"));

    return { success: true, message: `GCode saved to ${outputFilePath}` };
  } catch (error) {
    console.error("Error in IPC Plan handler:", error.message);
    return { success: false, message: `Error: ${error.message}` };
  }
});

// Plotting and running gcode remain unchanged
ipcMain.handle("plot", async (_, { gcodeFilePath, outputFilePath }) => {
  try {
    const gcodeContent = await fsPromises.readFile(gcodeFilePath, "utf8");
    const stream = plotGCode(gcodeContent.split("\n"));
    if (!stream) throw new Error("Failed to generate plot.");
    const fileStream = createWriteStream(outputFilePath);
    stream.pipe(fileStream);
    return { success: true, message: `Plot saved to ${outputFilePath}` };
  } catch (error) {
    return { success: false, message: `Error: ${error.message}` };
  }
});

ipcMain.handle("run", async (_, { gcodeFilePath, serialPort }) => {
  try {
    const gcodeContent = await fsPromises.readFile(gcodeFilePath, "utf8");
    const marlin = new MarlinPort(serialPort, false);
    await marlin.initialize();

    gcodeContent.split("\n").forEach((command) => marlin.queueCommand(command));
    return { success: true, message: "GCode sent successfully" };
  } catch (error) {
    return { success: false, message: `Error: ${error.message}` };
  }
});
