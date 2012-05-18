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

namespace.register('siderbar');
namespace.register('header');
namespace.register('time');

$(function() {

  header.height = 48;
  siderbar.width = 200;

  // resize时重新布局
  var resizeAllInOne = function() {
    $('#wrapper')[0].style.height = (window.innerHeight - header.height).toString() + 'px';
    $(".bDiv").height((window.innerHeight - header.height - 85).toString() + 'px');
//  if ($('#main').size > 0)
//    $('#main')[0].style.width = (window.innerWidth - 11 - siderbar.width).toString() + 'px';
//  $("#main")[0].style.height = (window.innerHeight - header.height).toString() + 'px';
  };

  // ============事件============

  // 事件：卡片的双击事件
  var contactBoxDblclick = function(e) {
  };

  // 事件：卡片的单击
  var contactBoxClick = function(e) {
    if (e.ctrlKey == true) {//按住ctrl的情况
      $(e.currentTarget).toggleClass('contact-box-checked');
    } else {
      $('.contact-box').removeClass('contact-box-checked');
      e.currentTarget.className += ' contact-box-checked';
    }
  };


// 窗口的resize事件监听
  $(window).resize(function() {
    resizeAllInOne();
  });

  // 提示消息
  var messageDisplay = function(msg, title) {
    if ($('#message').css("display") != "none") {
      clearTimeout(time);
      $('#message').hide('slide', { direction : 'down'}, 50);
    }
    $('#message h3').html(function() {
      return title || '提示信息';
    });
    $('#message p').html(msg);
    $('#message').show('slide', { direction : 'down'}, 200);
    // 待修改
    time = setTimeout(function() {
      $('#message').hide('slide', { direction : 'down'}, 200);
    }, 3000);
  };

  // ============对话框的定义============

  // 对话框：修改个人信息
  var accountEditDialog = function() {
    for (var i = 0 ; i < $('.account-edit-input').size() ; i++) {
      $('.account-edit-input')[i].value = $('.account-edit-input')[i].getAttribute('origin');
    }
    $('#account-edit-dialog').dialog({width : 'auto', buttons : {'保存' : function() {
      if ($('#baseEmail')[0].value == '')
        return messageDisplay('email是必须的');
      if ($('#basePhone')[0].value == '')
        return messageDisplay('电话也是必须的哦');
      // 提交
      $.post('/editAccount', $("#account-edit-form").serialize(), function(data) {
        if (data.success) {
          messageDisplay('修改个人资料成功');
          for (var i = 0 ; i < $('.account-edit-input').size() ; i++) {
            $('.account-edit-input')[i].setAttribute('origin', $('.account-edit-input')[i].value);
          }
          $('#account-edit-dialog').dialog('close');
        } else
          messageDisplay(data.message);
      }, "json");
    }, '取消' : function() {
      $('#account-edit-dialog').dialog('close');
    }}, show : { effect : 'drop', direction : "up" },
      hide : {effect : "drop", direction : "up"}, modal : true,
      resizable : false});
  };

  // 对话框：修改密码
  var passwordChangeDialog = function() {
    $('#password-change-dialog').dialog({width : 'auto', buttons : {'修改' : function() {
      //检验
      for (var i = 0 ; i < $('#password-change-dialog input').size() ; i++) {
        if ($('#password-change-dialog input')[i].value == '') {
          return messageDisplay('输入不完整！');
        }
      }
      if ($('#password-change-dialog input')[1].value)
        if ($('#password-change-dialog input')[1].value != $('#password-change-dialog input')[2].value) {
          return messageDisplay('新密码不一致！');
        }
      //提交
      $.post('/changePassword', $("#password-change-form").serialize(), function(data) {
        if (data.success) {
          messageDisplay('修改成功');
          $('#password-change-dialog').dialog('close');
        } else
          messageDisplay(data.message);
      }, "json");
    }, '取消' : function() {
      $('#password-change-dialog').dialog('close');
    }}, show : { effect : 'drop', direction : "up" },
      hide : {effect : "drop", direction : "up"}, modal : true,
      resizable : false});
  };

  // ============导航栏的事件绑定============

  //导航背景反黑
  $('#siderbar-in .forward').click(function() {
    $('#siderbar-in').find('li.active').removeClass('active');
    $(this).addClass("active");
  });

  // 条目：随便看看
  $('#random-results').click(function() {
    $('').hide();
    $.post('/randomResults', function(data) {
      if (data.success) {
        var results = eval('(' + data.results + ')');
        $('#contact-panel').html('');
        for (var i in results) {
          var div = $('<div class="contact-box"></div>');
          div.html(results[i].card);
          div.attr('accountid', results[i]._id);
          div.bind('dblclick', function(e) {
            contactBoxDblclick(e);
          });
          div.bind('click', function(e) {
            contactBoxClick(e);
          });
          $('#contact-panel')[0].appendChild(div[0]);
        }
      } else
        messageDisplay(data.message);
    }, "json");
    $('#main>div:first').hide();
    $("#contact-men").show();
  });

  // 条目：信息编辑
  $('#account-edit').click(function() {
    accountEditDialog()
  });

  // 条目：资料管理
  $('#message-manager').click(function() {
    $("#contact-men").hide();
    $("#main>div:first").show();
    $("#profile-manager").flexigrid({
//  url : 'post2.php',
      dataType : 'json',
      colModel : [
        {display : '序号', name : 'no', width : 100, sortable : true, align : 'center'},
        {display : '名字', name : 'name', width : 150, sortable : true, align : 'center'},
        {display : '内容', name : 'content', width : 600, sortable : true, align : 'left'}
      ],
      buttons : [
        {name : '添加', onpress : function() {
        }},
        {name : '删除', onpress : function() {
        }},
        {separator : true}
      ],
      searchitems : [
        {display : 'no', name : 'No'},
        {display : 'name', name : 'Name', isdefault : true}
      ],
      sortname : "no",
      sortorder : "asc",
//    usepager : true,
      title : '资料编辑',
      useRp : true,
//    showTableToggleBtn : true,
      width : '100%',
      height : window.innerHeight - header.height - 85
    });
  });

  // 条目：修改名片
  $('#password-change').click(function() {
    for (var input in $('.password-change-input')) {
      $('.password-change-input')[input].value = '';
    }
    passwordChangeDialog();
  });

  // ============图标的事件绑定============

  // 图标：头像
  $('#control-face').click(function() {
    accountEditDialog()
  });

  // 图标：LOGO，关于空中电话本
  $('#header-left').click(function(e) {
    $('#about-airbook-dialog').dialog({ buttons : {
      '好的' : function() {
        $('#about-airbook-dialog').dialog('close');
      }
    }, show : { effect : 'drop', direction : "up" },
      hide : {effect : "drop", direction : "up"}, modal : true,
      resizable : false});
  });

  // 图标：联系人卡片
  $('.contact-box').dblclick(function(e) {
    contactBoxDblclick(e)
  });

  // 图标：联系人卡片
  $('.contact-box').click(function(e) {
    contactBoxClick(e);
  });

  // 图标：添加联系人
  $('#add-contact').click(function() {
    var contacts = [];
    $('.contact-box-checked').each(function(index, e) {
      contacts.push(e.getAttribute('accountid'));
    });
    if (contacts.length == 0) return;
    $.post('/addContacts', {contacts : contacts}, function(data) {
      if (data.success) {
        messageDisplay(data.message);
      } else
        messageDisplay(data.message);
    }, "json");
  });

  // 图标：添加联系人
  $('#add-contact').click(function() {
  });

  resizeAllInOne();
});