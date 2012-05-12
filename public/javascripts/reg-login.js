// 实现一个命名空间
namespace = {};
namespace.register = function(name) {
  var parent = window;
  var arr = name.split('.');
  for (var i = 0 ; i < arr.length ; i++) {
    if (!parent[arr[i]]) {
      parent[arr[i]] = {};
    }
    parent = parent[arr[i]];
  }
};

namespace.register('app.sidebar');
namespace.register('app.header');

app.header.height = 48;
app.sidebar.width = 200;

// 窗口改变大小时改变背景颜色块
window.onload = function() {
  $('#wrapper')[0].style.height = (window.innerHeight - app.header.height).toString() + 'px';
}
$(window).resize(function() {
  $('#wrapper')[0].style.height = (window.innerHeight - app.header.height).toString() + 'px';
});

$('#control-register')[0].onclick = function() {
  console.log('dd');
  $('#login-div').hide();
  $('#register-div').show();
};

$('#control-login')[0].onclick = function() {
  console.log('dd');
  $('#register-div').hide();
  $('#login-div').show();
};
