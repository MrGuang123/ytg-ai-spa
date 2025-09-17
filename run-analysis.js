const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// TODO: 当前脚本文件也会移动到一个合适的位置

const { MastraClient } = require('@mastra/client-js');

async function main() {
  console.log('starting ai code analysis...');

  const apiKey = process.env.MASTRA_API_KEY1;
  if (!apiKey) {
    console.error('Error: apiKey variable is not found');
    process.exit(1);
  }

  const commitBefore = process.env.COMMIT_BEFORE;
  const commitAfter = process.env.COMMIT_AFTER;
  let changedFiles;
  if (commitBefore && commitAfter) {
    // 在CI环境中，使用精确的Commit hash
    console.log(`Analyzing changes between ${commitBefore} and ${commitAfter}`);
    const stdout = execSync(`git diff --name-only ${commitBefore} ${commitAfter}`).toString();
    // filter(Boolean)是一个过滤空字符串的简洁写法
    changedFiles = stdout.split('\n').filter(Boolean);
  } else {
    // 在本地测试时，回退到与master分支比较
    console.log(
      'CI env variables not found. Falling back to diff against master for local testing.'
    );
    try {
      const stdout = execSync('git diff --name-only --staged master').toString();
      changedFiles = stdout.split('\n').filter(Boolean);
    } catch (error) {
      // 如果没有文件在暂存区，可能会报错，所以需要try catch一下
      console.error(
        'Failed to diff against master. Make sure you have staged your changes (`git add .`)'
      );
      process.exit(1);
    }
  }

  // 获取变更文件列表，这里用了一个简单的git diff命令
  // 这个命令获取当前分支与master分支差异的文件
  // (三点语法): 这个语法的意思是：“请找出 A 分支和 B 分支的共同祖先提交，然后显示从这个共同祖先到 B 的所有变更。”
  // HEAD代表当前所在分支最新一次提交，origin/master代表master分支最新一次提交
  // 所以这个命令的意思是：“请找出master分支和当前分支的共同祖先提交，然后显示从这个共同祖先到当前分支的所有变更。”
  // const stdout = execSync('git diff --name-only origin/master...HEAD').toString();
  // const changeFiles = stdout
  //   .split('\n')
  //   .filter(f => f && (f.endsWith('.js') || f.endsWith('.ts') || f.endsWith('.tsx')));

  const filesToAnayze = changedFiles.filter(
    f => f && (f.endsWith('.js') || f.endsWith('.ts') || f.endsWith('.tsx'))
  );

  if (filesToAnayze.length === 0) {
    console.log('No code changes detected');
    process.exit(0);
  }

  console.log(`Found ${filesToAnayze.length} changed files`);
  console.log('Starting analysis...');

  const mastraClient = new MastraClient({ apiKey });
  const allIssues = [];

  // 遍历文件发送给AI来分析
  for (const file of filesToAnayze) {
    try {
      const content = fs.readFileSync(path.resolve(process.cwd(), file), 'utf-8');
      // TODO: 这个方法没有，这里的思想是使用client来分析文件的代码
      const result = await mastraClient.analyze({ fileName: file, content });

      if (result.status === 'failed') {
        allIssues = allIssues.concat(result.issues);
      }
    } catch (error) {
      console.error(`Error analyzing file ${file}: ${error.message}`);
    }
  }

  // 3. 根据分析的结果决定CI的成败
  if (allIssues.length > 0) {
    console.error(`Found ${allIssues.length} issues in the code`);
    allIssues.forEach(issue => {
      console.error(
        `${issue.message} in ${issue.location.file}:${issue.location.line}:${issue.location.column}`
      );
    });
    // 失败状态退出
    process.exit(1);
  } else {
    console.log('AI Analysis Passed! Your code looks great.');
    // 成功状态退出
    process.exit(0);
  }
}

main().catch(err => {
  console.error('An unexpected error occurred:', err);
  process.exit(1);
});

// const userMessage: Message = {
//   id: Date.now().toString(),
//   role: "user",
//   content: input.trim(),
//   timestamp: new Date(),
// };
// // 获取智能体
// const agent = mastraClient.getAgent(
//   "studyAssistantAgentDeepSeek"
// );

// // 流式响应
// const streamResponse = await agent.stream({
//   messages: [
//     {
//       role: "user",
//       content: userMessage.content,
//     },
//   ],
// });

// // 处理流式数据
// streamResponse.processDataStream({
//   onTextPart: (text) => {
//     console.log("收到文本:", text);
//     // 更新 UI - 追加文本到当前消息
//     setMessages((prev) =>
//       prev.map((msg) =>
//         msg.id === assistantMessageId
//           ? { ...msg, content: msg.content + text }
//           : msg
//       )
//     );
//   },
//   onToolCallPart: (toolCall) => {
//     console.log("工具调用:", toolCall);
//   },
// });
