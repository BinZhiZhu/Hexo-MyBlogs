---
title: 糟糕 玩cypress上瘾了
date: 2019-03-01 13:17:26
tags: [cypress,测试]
---

### 玩 e2e cypress 上瘾了，你们前端项目一般如何测试？

#### 前言

换了 Mac pro 不知不觉更喜欢深夜敲代码了，真的香！！！不知不觉已经快凌晨 4 点了，我带着困意还是打算发个帖子和大家共享一下我这几天琢磨的一些事情。本人其实是后端，但由于公司的发展与需求，开始着手维护前端项目，也一直在看 react （大佬可以带带我嘻）为了确保业务 flow 能够 stabling，最近公司前端项目在测试环节上选用了 e2e 的 cypress，琢磨了一阵子，体验还是很好的，开箱即用。

### 体验

- 开箱即用

- 官方 doc 很多，利于开发与维护

- gui 界面（ env：google 浏览器），可边测边调整

- 自定义 commands

- 自定义 fixture，可 mock 数据

- 支持 ci 运行测试，可上传到 bashBoard

- 关注测试覆盖率（ Chrome 的 coverage ）

- 截图功能，用例失败的场景节点会被截图保存，利于复现

- 录屏功能，每个测试用例都会记录下来（ MP4 ）

- 等等。。。  

  

### 实例

饿了么首页为例：验证搜索一个商品，断言如下：

```
it('输入搜索词，结果正确展示', () => {
  cy.visit('https://h5.ele.me/')
  // 点击跳转搜索页面
  cy.get('.search').click()

  cy.wait(200)
  cy.get('input').type('麻辣烫')

  cy.get('button').click()

  // 目标页面地址包含 search 点击列表第一项
  cy.wait(500)
  cy.url().should('include', 'search')
  cy.get('.shop').first().click()

  // 跳转至商家详情页，找到购物车元素
  cy.wait(500)
  cy.get('.cartview')
})
```

[原文链接]  <https://zhuanlan.zhihu.com/p/32666685>