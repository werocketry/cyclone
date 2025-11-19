import { IpcRenderer } from 'electron';

type DialogFilter = {
    name: string;
    extensions: string[];
};

type DialogOptions = {
    title?: string;
    defaultPath?: string;
    filters?: DialogFilter[];
};

declare global {
    interface File {
        path?: string;
    }

    interface Window {
        electron: {
            plan: (windFilePath: string, outputFilePath: string) => Promise<{ message: string }>;
            plot: (gcodeFilePath: string, outputFilePath: string) => Promise<{ message: string }>;
            run: (gcodeFilePath: string, serialPort: string) => Promise<{ message: string }>;
            openFileDialog: (options?: DialogOptions) => Promise<string | null>;
            saveFileDialog: (options?: DialogOptions) => Promise<string | null>;
        };
    }
}
