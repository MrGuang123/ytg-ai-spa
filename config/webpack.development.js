const { resolve, join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const notifier = require('node-notifier');

const port = 3000;

module.exports = {
    devServer: {
        historyApiFallback: true,
        hot: true,
        open: false, // 禁用自动打开浏览器，避免重复打开标签页
        port,
        static: {
            directory: join(__dirname, '../dist'),
        }
    },
    output: {
        publicPath: '/',
        // 通过loader编译的
        filename: 'scripts/[name].bundle.js',
        // 通过asset/resource编译的
        assetModuleFilename: 'images/[name].[hash][ext]',
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: resolve(__dirname, '../src/index-dev.html'),
        // favicon: './public/favicon.ico',
      }),
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: ['You application is running here http://localhost:' + port],
          notes: ['💊 构建信息请及时关注窗口右上角'],
        },
        onErrors: function (severity, errors) {
          if (severity !== 'error') {
            return;
          }
          const error = errors[0];
          console.log(error);
          notifier.notify({
            title: '👒 Webpack Build Error',
            message: severity + ': ' + error.name,
            subtitle: error.file || '',
            icon: join(__dirname, 'icon.png'),
          });
        },
        clearConsole: true,
      }),
    //   new BundleAnalyzerPlugin(),
    ],
}