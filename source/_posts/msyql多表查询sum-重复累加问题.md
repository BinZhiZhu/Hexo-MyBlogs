---
title: msyql多表查询sum()重复累加问题
date: 2019-01-08 18:22:17
tags: [mysql]
---
## 前言
  今天产品那边反馈了一个bug：部分订单金额（筛选场景）统计的订单总额不对。我就觉得好奇了，咋会部分就不对呢？然后我就开始场景复现了，果真复现了，我们一起来看下这个问题。
### 场景复现
1.搜索订单（一个订单多个商品），这样容易复现，订单号：SH20190107120514818483。
2.该订单购买了两个商品，A商品100元，B商品0元，合计是100元。
3.此时订单数：1 ;订单金额：200

![1](/blogimages/2018-1-8-2.png)

![2](/blogimages/2018-1-8-1.png)

### 定位问题
表：订单表（A）：shop_order 订单商品表（B）：shop_order_goods 

mysql 代码：
```
SELECT COUNT(DISTINCT(o.id)) as count, ifnull(sum(o.price),0) as sumprice  FROM ims_new_shop_order o  left join ims_new_shop_order_refund r on r.id =o.refundid  left join ims_new_shop_member m on m.openid=o.openid  and m.uniacid =  o.uniacid left join ims_new_shop_member_address a on o.addressid = a.id  left join ims_new_shop_saler s on s.openid = o.verifyopenid and s.uniacid=o.uniacid left join ims_new_shop_member sm on sm.openid = s.openid and sm.uniacid=s.uniacid left join ims_new_shop_order_goods sog on sog.uniacid = o.uniacid and sog.orderid = o.id  left join ims_new_shop_goods sg on sg.uniacid = o.uniacid and sg.id = sog.goodsid   WHERE  o.uniacid = 1 and o.deleted=0 and o.isparent=0 and o.istrade=0  AND locate('SH20190107120514818483',o.ordersn)>0  AND o.create_from_wxapp = 0
```

问题：我们会发现A表左连接B表的时候是不排除一对多的，也就是A表一条订单对应B表多条记录，但实际上这个时候我们需要去sum的金额仅仅是A表的订单金额，关联B表有多少记录我们是不需要在乎的。这个时候相当于重复统计了A表的订单金额，其实是受到了B表的影响。

### 解决方案
  我们应该应该怎么处理：

  实际上我们只需要在A表连接B表的时候，B表单独子查询处理，因为我们需要##去重B表的重复记录##，所有需要对B表group by进行分组，这样的话就不会出现sum累计的问题了。


 ##A left join (SELECT id,uniacid,orderid,goodsid FROM ims_new_shop_order_goods GROUP BY goodsid) ## AS sog on C##

 <!-- more -->
更改后代码：
```
SELECT COUNT(DISTINCT(o.id)) as count, ifnull(sum(o.price),0) as sumprice  FROM ims_new_shop_order o  left join ims_new_shop_order_refund r on r.id =o.refundid  left join ims_new_shop_member m on m.openid=o.openid  and m.uniacid =  o.uniacid left join ims_new_shop_member_address a on o.addressid = a.id  left join ims_new_shop_saler s on s.openid = o.verifyopenid and s.uniacid=o.uniacid left join ims_new_shop_member sm on sm.openid = s.openid and sm.uniacid=s.uniacid left join (SELECT id,uniacid,orderid,goodsid FROM ims_new_shop_order_goods GROUP BY goodsid) AS sog on sog.uniacid = o.uniacid and sog.orderid = o.id  left join ims_new_shop_goods sg on sg.uniacid = o.uniacid and sg.id = sog.goodsid   WHERE  o.uniacid = 1 and o.deleted=0 and o.isparent=0 and o.istrade=0  AND locate('SH20190107120514818483',o.ordersn)>0  AND o.create_from_wxapp = 0
```

![3](/blogimages/2018-1-8-3.png)
