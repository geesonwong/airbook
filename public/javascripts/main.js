// 实现一个命名空间
namespace = {};
namespace.register = function (name) {
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

function resizeAllInOne() {
  $('#wrapper')[0].style.height = (window.innerHeight - app.header.height).toString() + 'px';
  if ($('#main').size > 0)
    $('#main')[0].style.width = (window.innerWidth - 11 - app.sidebar.width).toString() + 'px';
}

// 窗口的resize事件监听
$(window).resize(function () {
  resizeAllInOne();
});

window.onload = function () {
  resizeAllInOne();
  if ($('#main').size > 0)
    $('#main')[0].style.marginLeft = $('#sidebar')[0].style.width = app.sidebar.width + 'px';
};


$('#control-register')[0].onclick = function () {
  console.log('dd');
  $('#login-div').hide();
  $('#register-div').show();
};

$('#control-login')[0].onclick = function () {
  console.log('dd');
  $('#register-div').hide();
  $('#login-div').show();
};
