// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
const getFileSystemPath = (file?: File | null) => {
  if (!file) {
    return null;
  }
  const electronFile = file as File & { path?: string };
  return electronFile.path ?? null;
};

document.getElementById("plan-button")?.addEventListener("click", async () => {
  const windFile = (document.getElementById("wind-file") as HTMLInputElement)?.files?.[0];
  const outputFile = (document.getElementById("output-file-plan") as HTMLInputElement)?.value;

  console.log("Wind File:", windFile);
  console.log("Output File:", outputFile);

  const windFilePath = getFileSystemPath(windFile);

  if (windFilePath && outputFile) {
    console.log("Wind File Path:", windFilePath);

    const result = await window.electron.plan(windFilePath, outputFile);
    document.getElementById("plan-output")!.textContent = result.message;
  } else {
    console.error("Wind file path or output file missing");
  }
});

document.getElementById("plot-button")?.addEventListener("click", async () => {
  const gcodeFile = (document.getElementById("gcode-file-plot") as HTMLInputElement)?.files?.[0];
  const outputFile = (document.getElementById("output-file-plot") as HTMLInputElement)?.value;

  // Debugging logs to check selected file and output path
  console.log('GCode File:', gcodeFile);
  console.log('Output File for Plot:', outputFile);

  const gcodeFilePath = getFileSystemPath(gcodeFile);

  if (gcodeFilePath && outputFile) {
    try {
      const result = await window.electron.plot(gcodeFilePath, outputFile); // Use window.electron
      console.log('Result from plot:', result); // Log result to verify response
      document.getElementById("plot-output")!.textContent = result.message;
    } catch (error) {
      console.error('Error in plot operation:', error);
    }
  } else {
    console.error('GCode file path or output file for plot is missing');
  }
});

document.getElementById("run-button")?.addEventListener("click", async () => {
  const gcodeFile = (document.getElementById("gcode-file-run") as HTMLInputElement)?.files?.[0];
  const serialPort = (document.getElementById("serial-port") as HTMLInputElement)?.value;

  // Debugging logs to check selected file and serial port
  console.log('GCode File for Run:', gcodeFile);
  console.log('Serial Port:', serialPort);

  const gcodeFilePath = getFileSystemPath(gcodeFile);

  if (gcodeFilePath && serialPort) {
    try {
      const result = await window.electron.run(gcodeFilePath, serialPort); // Use window.electron
      console.log('Result from run:', result); // Log result to verify response
      document.getElementById("run-output")!.textContent = result.message;
    } catch (error) {
      console.error('Error in run operation:', error);
    }
  } else {
    console.error('GCode file path or serial port is missing');
  }
});
