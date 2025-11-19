import type { DialogOptions } from "./dialog-types";

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
const getInputValue = (id: string) => {
  const input = document.getElementById(id) as HTMLInputElement | null;
  return input?.value.trim() ?? "";
};

const setInputValue = (id: string, value: string) => {
  const input = document.getElementById(id) as HTMLInputElement | null;
  if (input) {
    input.value = value;
  }
};

const setOutputMessage = (id: string, message: string) => {
  const output = document.getElementById(id);
  if (output) {
    output.textContent = message;
  }
};

const handleErrorMessage = (id: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  setOutputMessage(id, `Error: ${message}`);
  console.error(message);
};

const registerBrowseButton = (
  buttonId: string,
  inputId: string,
  dialogType: "open" | "save",
  options?: DialogOptions,
) => {
  document.getElementById(buttonId)?.addEventListener("click", async () => {
    try {
      const dialogOptions: DialogOptions = {
        ...(options ?? {}),
        defaultPath: getInputValue(inputId) || options?.defaultPath,
      };
      const path =
        dialogType === "open"
          ? await window.electron.openFileDialog(dialogOptions)
          : await window.electron.saveFileDialog(dialogOptions);

      if (path) {
        setInputValue(inputId, path);
      }
    } catch (error) {
      console.error(`Dialog error for ${buttonId}:`, error);
    }
  });
};

registerBrowseButton("wind-file-browse", "wind-file-path", "open", {
  title: "Select a .wind definition",
  filters: [{ name: "Wind Files", extensions: ["wind", "json"] }],
});

registerBrowseButton("output-file-plan-browse", "output-file-plan", "save", {
  title: "Save generated GCode",
  filters: [{ name: "GCode", extensions: ["gcode"] }],
});

registerBrowseButton("gcode-file-plot-browse", "gcode-file-plot", "open", {
  title: "Select an existing GCode file",
  filters: [{ name: "GCode", extensions: ["gcode"] }],
});

registerBrowseButton("output-file-plot-browse", "output-file-plot", "save", {
  title: "Save plotted PNG",
  filters: [{ name: "PNG Images", extensions: ["png"] }],
});

registerBrowseButton("gcode-file-run-browse", "gcode-file-run", "open", {
  title: "Select a GCode file to stream",
  filters: [{ name: "GCode", extensions: ["gcode"] }],
});

document.getElementById("plan-button")?.addEventListener("click", async () => {
  const windFilePath = getInputValue("wind-file-path");
  const outputFile = getInputValue("output-file-plan");

  if (!windFilePath || !outputFile) {
    setOutputMessage("plan-output", "Select both a .wind file and output path before planning.");
    return;
  }

  try {
    const result = await window.electron.plan(windFilePath, outputFile);
    setOutputMessage("plan-output", result.message);
  } catch (error) {
    handleErrorMessage("plan-output", error);
  }
});

document.getElementById("plot-button")?.addEventListener("click", async () => {
  const gcodeFilePath = getInputValue("gcode-file-plot");
  const outputFile = getInputValue("output-file-plot");

  if (!gcodeFilePath || !outputFile) {
    setOutputMessage("plot-output", "Select both a GCode file and PNG destination before plotting.");
    return;
  }

  try {
    const result = await window.electron.plot(gcodeFilePath, outputFile);
    setOutputMessage("plot-output", result.message);
  } catch (error) {
    handleErrorMessage("plot-output", error);
  }
});

document.getElementById("run-button")?.addEventListener("click", async () => {
  const gcodeFilePath = getInputValue("gcode-file-run");
  const serialPort = getInputValue("serial-port");

  if (!gcodeFilePath || !serialPort) {
    setOutputMessage("run-output", "Select a GCode file and enter a serial port before running.");
    return;
  }

  try {
    const result = await window.electron.run(gcodeFilePath, serialPort);
    setOutputMessage("run-output", result.message);
  } catch (error) {
    handleErrorMessage("run-output", error);
  }
});
