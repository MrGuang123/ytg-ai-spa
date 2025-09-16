const { resolve } = require('path');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { ThemedProgressPlugin } = require('themed-progress-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const argv = require('yargs-parser')(process.argv.slice(2));
const _mode = argv.mode || 'development';
const _mergeConfig = require(`./webpack.${_mode}.js`);
const _modeflag = _mode === 'production' ? true : false;

const webpackBaseConfig = {
  entry: {
    main: resolve(__dirname, '../src/index.tsx'),
  },
  // output: {
  //     path: resolve(__dirname, '../dist'),
  //     filename: '[name].js',
  // },
  resolve: {
    alias: {
      '@/*': ['src/*'],
      '@layout/*': ['src/layout/*'],
      '@routes/*': ['src/routes/*'],
      '@pages/*': ['src/pages/*'],
      '@hooks/*': ['src/hooks/*'],
      '@utils/*': ['src/utils/*'],
      '@components/*': ['src/components/*'],
      '@abis/*': ['src/abis/*'],
      '@connections/*': ['src/connections/*'],
      '@constants/*': ['src/constants/*'],
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ThemedProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: _modeflag ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
      chunkFilename: _modeflag ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
      ignoreOrder: false,
    }),
  ],
};

module.exports = merge(webpackBaseConfig, _mergeConfig);
