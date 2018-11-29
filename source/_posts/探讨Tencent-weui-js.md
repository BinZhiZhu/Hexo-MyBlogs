---
title: 探讨Tencent/weui.js
date: 2018-11-30 00:10:09
tags: [weui]
categories: 前端
---
##认识WeUI

  WeUI 的轻量级 js 封装。
  *注意：由于微信小程序不支持dom操作，所以weui.js并不适用于小程序。不过WeUI也为小程序开发了另外的版本，详情请看：https://github.com/Tencent/weui-wxss/*
  手机预览：https://weui.io/weui.js/
  
##安装

  ```
  git clone https://github.com/Tencent/weui.js.git
  cd weui.js
  npm install
  npm start
  ```
  
##编译

 ```
 npm run build
 
 ```
 
##使用

### global

````

<link rel="stylesheet" href="https://res.wx.qq.com/open/libs/weui/1.1.3/weui.min.css">
<script type="text/javascript" src="https://res.wx.qq.com/open/libs/weuijs/1.1.4/weui.min.js"></script>
<script type="text/javascript">
    weui.alert('alert');
</script>

````

### import as module

````
import 'weui';
import weui from 'weui.js';

weui.alert('alert');

````

##文档

[文档]：https://github.com/Tencent/weui.js/blob/master/docs/README.md


##Github

[github]：https://github.com/Tencent/weui.js