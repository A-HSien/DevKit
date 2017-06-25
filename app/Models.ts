

export interface Script {
  command: string;
  content: string;
};

export interface Project {
  path: string;
  scripts: Script[];
};

export class CommandOutput {
  title: string;
  time: number;

  constructor(
    public error: string,
    public stdout: string,
    public stderr: string
  ) {
    this.title = new Date().toLocaleString();
    this.time = Date.now();
  };
};