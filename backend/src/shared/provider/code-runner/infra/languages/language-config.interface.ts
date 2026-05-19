export interface LanguageConfig {
  name: string;
  imageName: string;
  fileName: string;
  compileCommand?: string;
  runCommand: string;
  timeoutMs: number;
}
