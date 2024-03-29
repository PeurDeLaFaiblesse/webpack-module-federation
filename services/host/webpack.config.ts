import {
  type BuildPaths,
  type Environments,
  getWebpackConfig,
} from "@packages/webpack-build";
import path from "path";
import { container } from "webpack";
import packageJson from "./package.json";

interface HostEnvironments extends Environments {
  adminRemoteURL?: string;
  showRemoteURL?: string;
}

export default (env: HostEnvironments) => {
  const mode = env.mode ?? "development";
  const port = env.port ?? 3000;
  const paths: BuildPaths = {
    entry: path.resolve(__dirname, "src", "index.tsx"),
    outputPath: path.resolve(__dirname, "build"),
    html: path.resolve(__dirname, "public", "index.html"),
    src: path.resolve(__dirname, "src"),
    public: path.resolve(__dirname, "public"),
  };
  const adminRemoteURL = env.adminRemoteURL ?? "http://localhost:3001";
  const showRemoteURL = env.showRemoteURL ?? "http://localhost:3002";

  const config = getWebpackConfig({
    port,
    mode,
    paths,
    isDev: mode === "development",
  });

  config.plugins.push(
    new container.ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        admin: `admin@${adminRemoteURL}/remoteEntry.js`,
        shop: `shop@${showRemoteURL}/remoteEntry.js`,
      },
      shared: {
        ...packageJson.dependencies,
        react: {
          eager: true,
          requiredVersion: packageJson.dependencies["react"],
        },
        "react-router-dom": {
          eager: true,
          requiredVersion: packageJson.dependencies["react-router-dom"],
        },
        "react-dom": {
          eager: true,
          requiredVersion: packageJson.dependencies["react-dom"],
        },
      },
    }),
  );

  return config;
};
