import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: "./src/index.tsx",
    output: {
      filename: isProduction ? "[name].[contenthash].js" : "bundle.js",
      path: path.resolve(dirname, "public"),
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    optimization: isProduction ? {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 20,
          },
          chartjs: {
            test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
            name: 'chartjs',
            priority: 15,
          },
        },
      },
      runtimeChunk: 'single',
      minimize: true,
      usedExports: true,
      sideEffects: false,
    } : {},
    performance: isProduction ? {
      hints: 'warning',
      maxEntrypointSize: 244000,
      maxAssetSize: 244000,
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js');
      }
    } : false,
    devtool: isProduction ? false : 'source-map',
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        inject: 'body',
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        } : false
      })
    ],
    devServer: {
      static: [{ directory: path.join(dirname, "public") }],
      compress: true,
      port: 3000,
    },
  };
};