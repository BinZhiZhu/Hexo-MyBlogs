---
title: Vue.js结合ElementUI的（分页）进行前端分页
date: 2018-11-17 00:19:31
tags: [Vue]
categories: 前端
---
## 前言
  我们在开发的过程中总会遇到某些项目需要根据后台接口返回的数据进行前端分页显示，举个例子：电商项目中的订单列表页面。  
后台点击订单列表页的时候会去请求后端接口，前端根据后端返回的订单数据进行分页显示。虽然自己是一个后端人员，但今天处理一个后台改版的任务的时候，  
订单列表页用Vue写的，在对接写好的接口的时候，就遇到了这个分页的问题。那我们就一起来看下这个问题一般要如何解决吧。

## 思路
  大致的想法是：后台返回所有订单数据，然后前端拿到返回的数据进行全部分页，这里注意的是：例如有100条记录，每页显示10条，这个时候实际分页效果是10页对吧，也就是说我们是  
后端一次性返回所有的订单数据，然后交给前端提前进行分页，每一页的数据我们在拿到后台返回的数据的时候前端就已经分好页了。

## 优点
  1. 分页切换的效果用户体验会更加顺畅；
  2. 当删除一条数据的时候过滤器会重新计算当前页面的显示数据

## 缺点
  1. 当页面数据量大的时候会浪费很多流量，因为有点类似于预加载的效果，一次把所有数据返回，数据多的时候RT时间会比较长
   
## 代码片段
 
### 过滤器
  我们应该先创建一个过滤器来过滤列表数据，这里有三个参数tabledata（列表数据），pageNum（当前第几页），pagesize（每页条数）
  ```
  filters:{
        pagination(tabledata,pageNum,pagesize){
          let offset = (pageNum - 1) * pagesize;//当前页第一条的索引
          let data=(offset + pagesize >= tabledata.length) ? array.slice(offset, tabledata.length) : array.slice(offset, offset + pagesize);
          return data
        }
      }
  ```
### 完整代码

  ```
  <template>
      <el-table :data="tableData | pagination(pageNum,pagesize)">
        <el-table-column label="">
            <template slot-scope="scope">
                
            </template>
        </el-table-column>
      </el-table>
      <el-pagination
       @size-change="handleSizeChange"
        @current-change="handleCurrentChange" 
        :current-page="pageNo" 
        :page-size="pageSize" 
        layout=" prev, pager, next, sizes, jumper" 
        :total="tableData.length">
        </el-pagination>
  </template>
  ```
  <!-- more -->
  上面是elementui 的pagination 分页组件代码片段，不理解的直接去看文档即可 
  
  ```
  <script>
    export default{
      data(){
        return {
          tableData: [{
               id:'',
               name:'',
          }],
          pagenum: 1,
          pagesize:10
        }
      },
      methods:{
        handleSizeChange(val) {
         console.log(`每页 ${val} 条`); 
          this.pagesize=val;
        },
        handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
          this.pageNum = val;
        }
      },
    filters:{
          pagination(tabledata,pageNum,pagesize){
            let offset = (pageNum - 1) * pagesize;//当前页第一条的索引
            let data=(offset + pagesize >= tabledata.length) ? array.slice(offset, tabledata.length) : array.slice(offset, offset + pagesize);
            return data
          }
        }
    }
  </script>
  ```
  
  总结：这种做法就比较舒服，用户体验也很好，切换分页的时候会很流畅。但还有另外的做法就是通过单页数据返回，每一次切换分页的时候去请求当前这个页面的数据，  
但是这种做法需要自己写上一页、下一页的方法，用户点击的时候去请求当前页面的数据去渲染，并不是一次性返回所有数据，这也是这种方法的优势，总的来说还得看具体的业务场景。
## 最后当然要贴一波效果图啊

![分页效果](/blogimages/11-17.png)