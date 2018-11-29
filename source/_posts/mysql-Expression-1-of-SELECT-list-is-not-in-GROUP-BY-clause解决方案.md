---
title: 'mysql-Expression #1 of SELECT list is not in GROUP BY clause解决方案'
date: 2018-11-30 00:45:20
tags: [mysql]
categories: 后端
---

##前言
  最近部署自己项目到服务器后，运行时mysql报错，抛出异常的代码为：
  ````
  Expression #1 of SELECT list is not in GROUP BY clause and contains nonaggregated column 'support_desk.mod_users_groups.group_id' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by
  ````
  谷歌翻译一下大概意思：
  
  **SELECT列表的表达式＃1不在GROUP BY子句中，并且包含非聚合列'support_desk.mod_users_groups.group_id'，它在功能上不依赖于GROUP BY子句中的列; 这与sql_mode = only_full_group_by不兼容**
  
## 解决方案
  实锤是因为MySQL版本的原因，我去StackOverflow查了相关的解决方案，最终还是解决了这个问题。
  
  - cd /etc/my.cnf 或者etc/mysql/my.cnf 不清楚路径可以 whereis my.cnf 打印pwd路径
  - vim my.cnf
  - 添加sql_mode
  ````
  [mysqld]
      sql_mode = STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
  ````
  - esc :wq 报错退出
  
  - 重启一下mysql服务 sudo service mysql restart / 或者/etc/init.d/mysql restart等等都可以
  
  - 除了上面这种方法也可以直接连接mysql 通过mysql->set ...[sql_mode] 类似
  
  这样问题就解决了，最后贴一下解决方案的地址
  
  [stackoverflow]：https://stackoverflow.com/questions/34115174/error-related-to-only-full-group-by-when-executing-a-query-in-mysql
  
  
  
