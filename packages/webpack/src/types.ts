export interface Environments {
  mode: 'development' | 'production';
  port: number;
}

export interface BuildPaths {
  entry: string;
  outputPath: string;
  html: string;
  src: string;
  public: string;
}

export interface WebpackConfigOptions extends Environments {
  paths: BuildPaths;
  isDev: boolean;
}
