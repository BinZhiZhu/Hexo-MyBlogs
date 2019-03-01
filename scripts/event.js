//监听 hexo new 事件
var spawn = require('child_process').exec;

hexo.on('new',function (data) {
    spawn('start  "markdown编辑器绝对路径.exe" ' + data.path);
});