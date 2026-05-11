export type DialogFilter = {
  name: string;
  extensions: string[];
};

export type DialogOptions = {
  title?: string;
  defaultPath?: string;
  filters?: DialogFilter[];
};
