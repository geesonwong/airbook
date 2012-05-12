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

function resizeAllInOne() {
  $('#wrapper')[0].style.height = (window.innerHeight - app.header.height).toString() + 'px';
  if ($('#main').size > 0)
    $('#main')[0].style.width = (window.innerWidth - 11 - app.sidebar.width).toString() + 'px';
}

// 窗口的resize事件监听
$(window).resize(function() {
  resizeAllInOne();
});

window.onload = function() {
  resizeAllInOne();
//  if ($('#main').size > 0)
//    $('#main')[0].style.marginLeft = $('#sidebar')[0].style.width = app.sidebar.width + 'px';
};

// 修改个人信息的窗口
var accountEditDialog = function() {
  $('#account-edit-dialog').dialog({width : 'auto', buttons : {'保存' : function() {
    console.log('保存');
  }, '取消' : function() {
    $('#account-edit-dialog').dialog('close');
  }}, show : { effect : 'drop', direction : "up" },
    hide : {effect : "drop", direction : "up"}, modal : true,
    resizable : false});
};

// 修改密码的窗口
var passwordChangeDialog = function() {
  $('#password-change-dialog').dialog({width : 'auto', buttons : {'修改' : function() {
  }, '取消' : function() {
    $('#password-change-dialog').dialog('close');
  }}, show : { effect : 'drop', direction : "up" },
    hide : {effect : "drop", direction : "up"}, modal : true,
    resizable : false});
};

$('#account-edit')[0].onclick = $('#control-face')[0].onclick = function() {
  accountEditDialog();
};

$('#password-change')[0].onclick = function() {
  passwordChangeDialog();
};
