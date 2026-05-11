import type { DialogOptions } from './dialog-types';

declare global {
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

export {};
