// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

import { contextBridge, ipcRenderer } from "electron";
import type { DialogOptions } from "./dialog-types";

const sanitizeDialogOptions = (options: DialogOptions = {}): DialogOptions => {
  const cleanFilters = Array.isArray(options.filters)
    ? options.filters
        .filter((filter) => Boolean(filter && Array.isArray(filter.extensions)))
        .map((filter) => ({
          name: filter.name,
          extensions: filter.extensions
            .map((ext) => (typeof ext === "string" ? ext.replace(/^\./, "") : ""))
            .filter((ext) => ext.length > 0),
        }))
        .filter((filter) => filter.extensions.length > 0)
    : undefined;

  return {
    title: typeof options.title === "string" ? options.title : undefined,
    defaultPath: typeof options.defaultPath === "string" ? options.defaultPath : undefined,
    filters: cleanFilters,
  };
};

contextBridge.exposeInMainWorld("electron", {
  plan: (windFilePath: string, outputFilePath: string) => {
    console.log('IPC Plan call - Wind File Path:', windFilePath);
    console.log('IPC Plan call - Output File Path:', outputFilePath);

    // Send the data to the main process
    return ipcRenderer.invoke("plan", { windFilePath, outputFilePath });
  },
  plot: (gcodeFilePath: string, outputFilePath: string) => {
    console.log('IPC Plot call - GCode File Path:', gcodeFilePath);
    console.log('IPC Plot call - Output File Path:', outputFilePath);
    return ipcRenderer.invoke("plot", { gcodeFilePath, outputFilePath });
  },
  run: (gcodeFilePath: string, serialPort: string) => {
    console.log('IPC Run call - GCode File Path:', gcodeFilePath);
    console.log('IPC Run call - Serial Port:', serialPort);
    return ipcRenderer.invoke("run", { gcodeFilePath, serialPort });
  },
  openFileDialog: (options?: DialogOptions) => {
    return ipcRenderer.invoke("dialog:openFile", sanitizeDialogOptions(options));
  },
  saveFileDialog: (options?: DialogOptions) => {
    return ipcRenderer.invoke("dialog:saveFile", sanitizeDialogOptions(options));
  },
});


window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type as keyof NodeJS.ProcessVersions]);
  }
});
