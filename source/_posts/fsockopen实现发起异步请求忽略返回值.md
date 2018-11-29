---
title: fsockopen实现发起异步请求忽略返回值
date: 2018-11-29 21:58:29
tags: [Http,Php]
categories: 后端
---

##前言
  前段时间有个需求，我大概描述一下：用户进入公众号或者小程序的所有操作类行为的日志需要后端上报到内部的客户雷达小程序，而且需要异步请求，不需要等待返回。
简单来说就是当用户进入小程序点击某件商品或者加入购物车、下单等等操作，上报到雷达小程序，商户会时序看到哪个用户进来我的商店买了哪件商品，浏览了哪些商品，下了多少单等等，都可以随时看到。
这个时候我们就可能要需要思考了，要如何做到发起异步请求并且忽略返回值，前端那边不需要等待后端的返回，我也查看过相关资料，最后参考了下面这种方法。

## 发起异步请求 忽略返回值（后端技术PHP）

  自己封装一个方法吧 我直接上代码
  
  ```
  /**
   * 发起异步请求，忽略返回值
   * @param $url 上报地址 例如http://www.binzhizhu.top
   * @param array $params 上报的参数
   * @return bool
   */
  public static function asyncPost($url, $params = [])
  {
      Yii::info("into asyncPost ", __METHOD__);
      
      $args = parse_url($url); 
      $host = $args['host']; //域名
      $path = $args['path'] . '?' . http_build_query($params);//上报的参数

      $fp = fsockopen($host, 80, $error_code, $error_msg, 1);//使用fsockopen方法发起异步请求
      
      if (!$fp) {
          Yii::error($error_code . ' _ ' . $error_msg, __METHOD__);
          return false;
      } else {
          stream_set_blocking($fp, true);//开启了手册上说的非阻塞模式
          stream_set_timeout($fp, 1);//设置超时
          $header = "GET $path HTTP/1.1\r\n"; // GET/POST请求 http1.1协议
          $header .= "Host: $host\r\n";
          $header .= "Connection: close\r\n\r\n";//长连接关闭
          fwrite($fp, $header);
          fclose($fp);
      }
  }
      
      ```
