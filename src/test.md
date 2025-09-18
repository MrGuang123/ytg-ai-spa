通过运行一个 JS 脚本来模拟客户端与服务端的交互来进行代码分析
第一步：
准备 API 接口地址
CI 调用需要认证，以防止接口被滥用，简单方式使用 API key，在请求头添加这个 key。
定义结构化的响应
第二步：创建脚本
第三步：在 githubActions 中调用脚本
新增一个 job
在 github 的 settings - Secrets and variables - Actions - new repository secret，创建一个 secret，值为服务端的 APIkey，这个可以确保秘钥不会被硬编码在代码中
修改 ci.yml

yarn add @mastra/client-js
添加脚本还需要完善
还需要再 CI 中添加 job

yarn add @testing-library/react @testing-library/jest-dom @testing-library/dom -D
yarn add @swc/helpers jest-environment-jsdom -D
@testing-library/react：这是编写 React 组件测试的核心库。
@testing-library/jest-dom：这个库为 Jest 提供了 .toBeInTheDocument() 等便利的 DOM 断言方法。
jest-environment-jsdom：这个库为 Jest 提供了在 Node.js 中模拟浏览器环境的能力，这是测试 DOM 组件所必需的。
@testing-library/dom：提供了 render 方法
@swc/helpers：在 jest 中 swc 转换 TS 代码的时候需要一些辅助函数

testEnvironment 从 node 改为 'jest-environment-jsdom'
setupFilesAfterEnv: ['./jest.setup.ts'],新增 setup 是用来拓展 jest 功能的
