---
title: cypress-file-upload真的香
date: 2019-06-06 21:14:30
tags: [cypress，测试]
---

## cypress-file-upload 是什么

之前有写过一遍博客大致介绍了cypress是什么：前端e2e测试框架(歪果仁开发)。  

最近因为有个项目因为改版的原因，差不多到上线的节点了，所以还是希望把测试维护起来。e2e实际上就是end to end 嘛，你如果直接理解为验收测试也不为过。众所周知咯，维护前端测试实际上是一件很麻烦的事情，因为有复杂的业务、复杂的UI交互，人工测试实在是太耗时费力(成本)，另外前端项目是比较不那么stable 的。因为前端样式是可能时常变化的，今天断言的这个按钮是红色、明天可能是白色了。所以对于小型公司来说的话，建议是在一个stable 的阶段去维护比较有收益，最近的项目改版就是一个有力的例子。V1版本维护了一套stable的测试用例，突然说需要改版，基本是换肤，对于UI来说基本是不一致的了，这导致之前维护的版本的测试基本是需要重新维护的了。

## 为什么要使用cypress-file-upload

前端很多场景是需要上传文件的，最通常的就是上传图片。也就是说我们写测试的过程中，例如填写一个表单，需要上传图片，然后才能提交到后台。所以我们是需要模拟上传图片的，简单来说就是把这个事情自动化，本来我们就是自动化测试嘛。之前也写过一些cypress简单的用例，但是上传图片之前没去琢磨过，于是我就去gayhub疯狂的search issues ，大致关键词就是："cypress how to upload file"。果不其然，还是挺多歪果仁提过这个issue的，所以我就大致认真的看了一下，因为都是英文，所以还是得认真的去消化 ：）。我发现了一个关键的issue：https://github.com/cypress-io/cypress/issues/170  然后摸石头过河，发现有些朋友贴出的好的idea ：cypress-file-upload , 直接npm install - -save -dev cypress-file-upload 就可以，具体可以直接Google咯。



首先先 npm 安装 cypress-file-upload 哦

大致的用法是，这里贴一下代码块：

```
/**
 *  上传图片 【自己封了一层】
 *
 *  参考  https://github.com/cypress-io/cypress/issues/170
 */
Cypress.Commands.add('uploadFile', (fileName, fileType, selector,subjectType) => {
  cy.fixture(fileName).then(fileContent => {
    // console.log('fileContent',fileContent)
    cy.get(selector).upload(
      { fileContent, fileName, mimeType: fileType },
      { subjectType: subjectType },
    );
  });
});


   //模拟图片上传
    const fileName = 'images/logo.png';
    const fileType = 'image/png';
    const subjectType = 'input';
    const selector = 'input[type="file"]'

    cy.uploadFile(fileName,fileType,selector,subjectType)
```

有几点注意的：

1. uploadFile是自己封装的func，需要统一放在commands.js [官方提供的diy func]
2. 此时直接使用cy.get(…).upload('') 是会报错的 找不到upload 方法，我们需要在commands.js 引入 import 'cypress-file-upload' ，之前我也以为npm 安装了即可，但是后来去gayhub 发现需要在commands import一次



最后大功告成咯 ： ）  ci 上跑了一波 没啥问题 大功告成 cypress真的香哦 

<video src="/Users/apple/Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat/2.0b4.0.9/2ae4ac7ee7b52045568b2f00f252714c/Message/MessageTemp/f86605ec697634cf912542f2dc13a2a1/Video/master_certify_center.js_1559822306858595.mp4"></video>

