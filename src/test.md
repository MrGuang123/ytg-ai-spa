安装Webpack和cli yarn add webpack webpack-cli -D  
配置swc-loader  yarn add -D @swc/core swc-loader
配置Webpack module  添加.swcrc
配置Webpack的entry内容

yarn add -D typescript

yarn add scripty -D 在根目录添加scripts目录内容，对应package.json中命令
chmod -R a+x scripts给scripts目录添加执行权限

安装biomejs，功能类似eslint，几乎零配置的lint功能，yarn add -D @biomejs/biome
yarn exec biome init
yarn exec biome check --write ./src
安装biome的vscode拓展

husky  yarn add --dev husky  npx husky init

yarn add react react-dom react-router-dom
yarn add @types/react @types/react-dom -D
添加tsconfig.json，可以自己找或者AI生成

yarn add jotai immer jotai-immer  可以解决状态撕裂，会渲染两遍，先给值，再强制更新
recoil也可以解决状态撕裂
Jotai是组件内状态，zustand是组件外状态，有限状态机xstate

yarn add @welldone-software/why-did-you-render -D  开发环境检测哪些不必要的渲染
添加一个wdyr.tsx文件，里面写上开发环境引用，然后在index.tsx引入，最起码要放在要监控的组件上面
需要监控的组件添加  ComponentName.whyDidYouRender = true;

yarn add webpack-dev-server webpack-bundle-analyzer @soda/friendly-errors-webpack-plugin node-notifier -D
配置webpack.development.js
yarn add terser-webpack-plugin css-minimizer-webpack-plugin html-webpack-plugin -D
配置webpack.production.js
yarn add webpack-merge yargs-parser -D
yarn add clean-webpack-plugin themed-progress-plugin -D

yarn add tailwindcss @tailwindcss/postcss postcss -D
yarn add style-loader css-loader postcss-loader -D
yarn add mini-css-extract-plugin -D
创建postcss.config.js添加配置，在index.css中引入@import "tailwindcss";
preset-env.cssdb.org/features  所有cssnext特性
css-doodle.com 很多增强的@特性

e2e测试：有头浏览器 selenium-webdriver  无头：rize.js + puppetter
有头+无头  cypress  yarn add cypress -D  yarn cypress open是打开cypress的界面
选择：continue -> e2e test -> continue -> chrome  完事会打开http://localhost:65436/__/#/specs



UI测试：backstop


yarn add @swc/jest jest @types/jest jest-stare -D
package.json添加命令
"test:e2e": "cypress open",
"test": "jest --collectCoverage --reporters default jest-stare",
jest-stare是一个报表
package.json添加配置



以下是在合约目录的操作，当前是前端目录，前端架构指南7，8文档中有描述
如果使用的ethersV6 可以添加一个包typechain 这个作用
静态类型 —— 你再也不会调用不存在的方法了
IDE 支持 —— 适用于任何支持 TypeScript 的 IDE
可扩展 —— 可与许多不同的工具配合使用：ethers.js、hardhat、truffle、Web3.js，或者你可以创建自己的目
yarn add @typechain/ethers-v6 typechain -D
// 佳哥实际使用例子
"generate-types": "typechain --target=ethers-v6 'build/contracts/*.json'"
// 文档demo
typechain --target ethers-v6 --out-dir app/contracts './node_modules/neufund-contracts/build/contracts/*.json'
https://www.npmjs.com/package/typechain
会在hardhat目录下生成一个types目录，将生成的所有ts类型放到前端的types目录下

@chainlink/env-enc 这个库用来加密环境变量