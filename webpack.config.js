

import path from "path";
import webpack from "webpack";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

export default () => {
  return {
    mode: "development",
    entry: "./public/js/app.js",
    output: {
      filename: "bundle.js",
      path: path.join(__dirname,"./public/dist"),
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env", { targets: "defaults" }]],
            },
          },
        },
      ],
    },
  };
};
