---
title: 优雅的提交你的Git-commit
date: 2019-06-30 11:55:39
tags: [git]
---

## Commitizen: 替代你的 git commit

## 介绍

[commitizen/cz-cli](https://link.zhihu.com/?target=https%3A//github.com/commitizen/cz-cli), 我们需要借助它提供的 git cz 命令替代我们的 git commit 命令, 帮助我们生成符合规范的 commit message.

除此之外, 我们还需要为 commitizen 指定一个 Adapter 比如: [cz-conventional-changelog](https://link.zhihu.com/?target=https%3A//github.com/commitizen/cz-conventional-changelog) (一个符合 Angular团队规范的 preset). 使得 commitizen 按照我们指定的规范帮助我们生成 commit message.

### 安装

```bash
npm install -g commitizen cz-conventional-changelog
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
```

## 使用

通常我们提交代码是使用 git commit -m 的形式，现在直接使用git cz 即可替代。

## 规范

- type: commit 的类型
- feat: 新特性
- fix: 修改问题
- refactor: 代码重构
- docs: 文档修改
- style: 代码格式修改, 注意不是 css 修改
- test: 测试用例修改
- chore: 其他修改, 比如构建流程, 依赖管理.
- scope: commit 影响的范围, 比如: route, component, utils, build...
- subject: commit 的概述, 建议符合 [50/72 formatting](https://link.zhihu.com/?target=https%3A//stackoverflow.com/questions/2290016/git-commit-messages-50-72-formatting)
- body: commit 具体修改内容, 可以分为多行, 建议符合 [50/72 formatting](https://link.zhihu.com/?target=https%3A//stackoverflow.com/questions/2290016/git-commit-messages-50-72-formatting)
- footer: 一些备注, 通常是 BREAKING CHANGE 或修复的 bug 的链接.

### standard-version: 自动生成 CHANGELOG

#### 安装使用

```bash
npm i -S standard-version
```

#### 配置

package.json :

```
"scirpt": {
    ...,
    "release": "standard-version"
}
```



#### 使用

```
npm run release
```

你会发现你git cz 的提交会自动生成一个CHANGELOG.md

