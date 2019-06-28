---
title: MongoDB基础学习笔记
date: 2019-06-24 00:20:40
tags: [MongoDB]
---

## 非关系型数据库(NoSql)：MongoDB

### 与关系型数据库的比较

关系型数据库(MySQL)：数据库、数据表（table）、数据行

MongoDB：数据库、集合（collections）、文件

我们发现本质的关系还是不变的

### 安装与运行

我这边的开发环境是统一使用docker部署的，所以只需要在docker-composer补充MongoDB的配置即可，代码如下：

```yaml
 # 十分吃内存的nosql数据库
  mongo:
    image: mongo
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: 123456
    ports:
      - 27017:27017
    volumes:
      - ./mongo:/data/db
```

- 在该yaml文件目录下启动docker-composer容器配置：docker-composer up -d
- docker ps确认容器有没有启动
- 启动MongoDB咯：docker run mongo 或者 docker exec -it 容器ID (我是喜欢用这个)

推荐直接使用：docker exec -it 容器ID mongo admin，这个时候我们数据库的操作会发现没有权限，这个问题刚开始困扰我很久，因为是新手。后来发现实际上是因为我们连接之后没有鉴权，我们需要使用一个身份去鉴权，也就是我们docker-composer里的root用户，所以我们需要：db.auth("root","123456") ,这样就代表鉴权成功，可以继续操作curd了。

简单的操作失败信息：

```shell
> use admin
switched to db admin
> db
admin
> db.createCollection("test")
{
	"ok" : 0,
	"errmsg" : "command create requires authentication",
	"code" : 13,
	"codeName" : "Unauthorized"
}
```

很明显提示没有权限操作咯

### 命令行基础命令

- show dbs :显示已有数据库，如果你刚安装好，会默认有local、admin(config)，这是MongoDB的默认数据库，我们在新建库时是不允许起这些名称的。
- use admin： 进入数据，也可以理解成为使用数据库。成功会显示：switched to db admin。
- show collections: 显示数据库中的集合（关系型中叫表，我们要逐渐熟悉）。
- db:显示当前位置，也就是你当前使用的数据库名称，这个命令算是最常用的，因为你在作任何操作的时候都要先查看一下自己所在的库，以免造成操作错误。

- use db（建立数据库）：use不仅可以进入一个数据库，如果你敲入的库不存在，它还可以帮你建立一个库。但是在没有集合前，它还是默认为空。
- db.集合.insert( ):新建数据集合和插入文件（数据），当集合没有时，这时候就可以新建一个集合，并向里边插入数据。Demo：db.user.insert({ "name":"jacky","hobby":"唱、跳、rap、篮球"});
- db.集合.find( ):查询所有数据，这条命令会列出集合下的所有数据，可以看到MongoDB是自动给我们加入了索引值的。Demo：db.user.find()
- db.集合.findOne( ):查询第一个文件数据，这里需要注意的，所有MongoDB的组合单词都使用首字母小写的驼峰式写法。
- db.集合.update({查询},{修改}):修改文件数据，第一个是查询条件，第二个是要修改成的值。这里注意的是可以多加文件数据项的，比如下面的例子。

- db.集合.remove(条件)：删除文件数据，注意的是要跟一个条件。Demo: db.user.remove({
  ... "name":"mike"}
  ... );
- db.集合.drop( ):删除整个集合，这个在实际工作中一定要谨慎使用，如果是程序，一定要二次确认。
- db.dropDatabase( ):删除整个数据库，在删除库时，一定要先进入数据库，然后再删除。实际工作中这个基本不用，实际工作可定需要保留数据和痕迹的

![](http://img.binzhizhu.top/imgs/2019/06/9b137700ebf6ea6a.jpg)



### 使用JavaScript敲打MongoDB命令



