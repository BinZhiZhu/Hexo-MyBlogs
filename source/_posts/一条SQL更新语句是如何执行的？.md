---
title: post一条SQL更新语句是如何执行的？
date: 2020-02-23 22:27:24
tags: [mysql]
---
```
例子：update T set c=c+1 where id=2
```
  与查询流程不一样的是，更新流程还涉及两个重要的日志模块，它们正是我们今天要讨论 的主角：redo log（重做日志）和 binlog（归档日志）。如果接触 MySQL，那这两个词 肯定是绕不过的，我后面的内容里也会不断地和你强调。不过话说回来，redo log 和 binlog 在设计上有很多有意思的地方，这些设计思路也可以用到你自己的程序里。
  
## 重要的日志模块：redo log（物理日志）
1.核心要点：其实就是 MySQL 里经常说到的 WAL 技术，WAL 的全称 是 Write-Ahead Logging。也就是先记日志，再写到磁盘。具体来说，当有一条记录需要更新的时候，InnoDB 引擎就会先把记录写到redo log里面，并更新内存，这个时候更新就算完成了。同时，InnoDB 引擎会在适当的时候，将这个操作记录更新到磁盘里面，而这个更新往往是在系统比较空闲的时候做。
InnoDB的redo log是有固定大小的，例如可以一组配置4个文件，每个文件也有固定的大小，例如1GB,那么这一组就共有4GB内存（结合粉板理解）。写日志是从头开始写，写到末尾又开始回到开头循环写（大致就是顺时针的时钟概念）。主要操作分为：write pos和checkpoint，前者是写日志，后者理解为擦粉板，write pos 和 checkpoint 之间的是“粉板”上还空着的部分，可以用来记录新的操作。如 果 write pos 追上 checkpoint，表示“粉板”满了，这时候不能再执行新的更新，得停下 来先擦掉一些记录，把 checkpoint 推进一下。
有了 redo log，InnoDB 就可以保证即使数据库发生异常重启，之前提交的记录都不会丢 失，这个能力称为crash-safe。
2.将 redo log 的写入拆成了两个步骤： prepare 和 commit，这就是"两阶段提交"。执行器写完binlog之后，redo log执行commit操作。

## 重要的日志模块：binlog (逻辑归档日志)
  binlog是Server层自己的日志，没有crash-safe能力，后来有了InnoDB插件引擎，补充了这个能力，也就是实现了redo log日志系统。
  
## 两种日志的对比
1. redo log 是 InnoDB 引擎特有的；binlog 是 MySQL 的 Server 层实现的，所有引擎 都可以使用。   
2. redo log 是物理日志，记录的是“在某个数据页上做了什么修改”；binlog 是逻辑日志，记录的是这个语句的原始逻辑，比如“给 ID=2 这一行的 c 字段加 1 ”。  
3. redo log 是循环写的，空间固定会用完；binlog 是可以追加写入的。“追加写”是指binlog文件写到一定大小后会切换到下一个，并不会覆盖以前的日志。


## 小结
redo log 用于保证 crash-safe 能力。innodb_flush_log_at_trx_commit 这个参数设置成 1 的时候，表示每次事务的 redo log 都直接持久化到磁盘。这个参数我建议你设置成 1， 这样可以保证 MySQL 异常重启之后数据不丢失。  
sync_binlog 这个参数设置成 1 的时候，表示每次事务的 binlog 都持久化到磁盘。这个 参数我也建议你设置成 1，这样可以保证 MySQL 异常重启之后 binlog 不丢失。
