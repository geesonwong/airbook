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
namespace.register('active');

$(function() {

  header.height = 48;
  siderbar.width = 200;
  active = $('#siderbar-in').find('li.active');

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

    if (active[0] == $('#random-results')[0]) {
      messageDisplay('请在联系人面板添加备注和标签');
      return;
    }

    $('#file-contacter-id-hidden').val($(this).attr('contactid'));
    $('#file-contacter-dialog input')[1].value = $(this).attr('comment') || '';
    $('#file-contacter-dialog input')[2].value = $(this).attr('tags') || '';
    $("#file-contacter-dialog").dialog({resizable : false, width : 330, height : 'auto', modal : true, buttons : {
      "就这样吧" : function() {
        $.post('/fileContacter', $("#file-contacter-form").serialize(), function(data) {
          if (data.success) {
            messageDisplay('归档成功');
            $('#file-contacter-dialog').dialog('close');
            active[0] = $('#my-contacts');
            $('#homeless-contacts').trigger('click');
          } else
            messageDisplay(data.message);
        }, "json");
      },
      '等下次哟…' : function() {
        $(this).dialog("close");
      }
    }, show : { effect : 'drop', direction : "up" },
      hide : {effect : "drop", direction : "up"}
    });

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

  $(".contact-box").live("click", contactBoxClick).live("dblclick", contactBoxDblclick);

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
  var accountEditDialog = function(necessary) {
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
          window.location.reload();
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

//   对话框：创建集体
  var createCollectiveDialog = function() {
    var patrnName = /^[a-zA-Z]{1}([a-zA-Z0-9]){4,19}$/;  //检验名字
    var patrnPhone = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;  //检验电话号码
    var patrnIsQq = /^\s*[.0-9]{5,10}\s*$/; //检验是否位数字
    var patrnIsEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; //检验是否为email
    var patrnIsUrl = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;

    $("#create-collective-form *").val("");
    $('#create-collective-dialog').dialog({width : 'auto', buttons : {'创建' : function() {
      if (!$('#collectiveName').val()) {
        return messageDisplay('帐号名不能为空');
      } else if (!patrnName.exec($('#collectiveName').val())) {
        return messageDisplay('用户名必须由5-20个以字母开头、可带数字的字串组成 ');
      }
      if (!$('#collectivePassword').val()) {
        return messageDisplay('密码不能为空');
      }
      else if ($('#collectivePassword').val() != $('#collectiveRepassword').val()) {
        return messageDisplay('两次输入密码不一致');
      }
      if (!$('#collectiveFName').val()) {
        return messageDisplay('名字不能为空');
      }
      if (!$('#collectiveBaseEmail').val()) {
        return messageDisplay('邮箱不能为空');
      }
      if (!patrnIsEmail.exec($('#collectiveBaseEmail').val())) {
        return messageDisplay('邮箱格式不正确 ');
      }
      if (!$('#collectiveBasePhone').val()) {
        return messageDisplay('电话也是必须的哦');
      } else if (!patrnPhone.exec($('#collectiveBasePhone').val())) {
        return messageDisplay('不正确的号码格式');
      }
      if ($('#collectiveQq').val() && (!patrnIsQq.exec($('#collectiveQq').val()))) {
        return messageDisplay('不正确的QQ号码格式');
      }

      if ($('#collectiveHomepage').val() && (!patrnIsUrl.exec($('#collectiveHomepage').val()))) {
        return messageDisplay('不正确的url格式');
      }
      // 提交
      $.post('/createCollective', $("#create-collective-form").serialize(), function(data) {
        if (data.success) {
          messageDisplay('创建集体成功');
<<<<<<< HEAD
          $('#create-collective-dialog').dialog('close');
=======
          $('#account-edit-dialog').dialog('close');
          window.location.reload();
>>>>>>> airbook/master
        } else
          messageDisplay(data.message);
      }, "json");

    }, '取消' : function() {
      $('#create-collective-dialog').dialog('close');
    }
    }, show : { effect : 'drop', direction : "up" },
      hide : {effect : "drop", direction : "up"}, modal : true,
      resizable : false
    });
  };

  // ============导航栏的事件绑定============

  //导航背景反黑
  $('#siderbar-in .forward').click(function() {
    if (this == active[0]) {
      this.flag = 0;
      return;
    }
    active.removeClass('active');
    $(this).addClass("active");
    this.flag = 1;
    active = $(this);
  });

  //  增删名片
  var getCard = function(that, url,container,outercontainer) {
    if (!that.flag) {
      return;
    }
    $.post(url, function(data) {

      if (data.success) {
        var results = JSON.parse(data.results)
        $(container).html('');
        var i , div;
        if (data.type == 'account') {// 随机查看
          for (i in results) {
            div = $('<div class="contact-box"></div>');
            div.html(results[i].card);
            div.attr('accountid', results[i]._id);
            $(container)[0].appendChild(div[0]);
          }
        } else {
          for (i in results) {
            div = $('<div class="contact-box"></div>');
            div.html(results[i]._contacter.card);
            div.attr('accountid', results[i]._contacter._id);
            div.attr('contactid', results[i]._id);
            div.attr('tags', results[i].tags.join(' '));
            div.attr('comment', results[i].comment);
            $(container)[0].appendChild(div[0]);
          }
        }
      } else {
        messageDisplay(data.message);
        $(container).html('<div id="nothing-to-display">' + data.message + '</div>');
      }
    }, "json");
    $('#main>div').hide();
    $(outercontainer).show();
  };

  // 条目：随便看看
  $('#random-results').click(function() {
    var that = this;
<<<<<<< HEAD
    getCard(that, "/randomResults","#contact-panel","#contact-men");
=======
    getCard(that, "/randomUserResults");
  });

  // 条目：所有集体
  $('#all-groups').click(function() {
    var that = this;
    getCard(that, "/randomGroupResults");
>>>>>>> airbook/master
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
    $('.password-change-input').val('');
    passwordChangeDialog();
  });

//  我的集体
  $('#my-collective').click(function() {
    var that = this;
    getCard(that, "/myCollective","#collective-panel","#collective-men");
//    $("#autocomplete").autocomplete({
//      source:function(request,response){
//        $.post()
//      }
//    });
  });

  //未归档联系人
  $('#homeless-contacts').click( function() {
      var that = this;
      getCard(that, "/homelessContacts","#contact-panel","#contact-men");
    }).trigger('click');

//我的联系人
  $('#my-contacts').click(function() {
    var that = this;
    getCard(that, "/myContacts","#contact-panel","#contact-men");
  });

//  创建集体
  $("#create-collective").click(function() {
    createCollectiveDialog();
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

  // 图标：添加联系人
  $('#add-contact').click(function() {
    if (!$('.contact-box-checked').length) {
      messageDisplay('没有选择联系人。可以按住ctrl多选哦');
      return;
    }
    if (active[0] == $('#homeless-contacts')[0] || active[0] == $('#my-contacts')[0]) {
      messageDisplay('已经是联系人');
      return;
    }
    var accounts = [];
    $('.contact-box-checked').each(function(index, e) {
      accounts.push(e.getAttribute('accountid'));
    });
    $.post('/addContacts', {accounts : accounts}, function(data) {
      if (data.success) {
        messageDisplay(data.message);
//        active[0] = $('#my-contacts');
//        $('#random-results').trigger('click');
      } else
        messageDisplay(data.message);
    }, "json");
  });

  // 图标：删除联系人
  $('#remove-contact').click(function() {
    if (!$('.contact-box-checked').length) {
      messageDisplay('没有选择联系人。可以按住ctrl多选哦');
      return;
    }
    if (active[0] == $('#random-results')[0]) {
      messageDisplay('未添加为联系人');
      return;
    }
    var accounts = [];
    $('.contact-box-checked').each(function(index, e) {
      accounts.push(e.getAttribute('accountid'));
    });
    $.post('/removeContacts', {accounts : accounts}, function(data) {
      if (data.success) {
        messageDisplay(data.message);
        window.location.reload();
      } else
        messageDisplay(data.message);
    }, "json");
  });

  // 图标：归档联系人
  $('#file-contact').click(function() {
    if (!$('.contact-box-checked').length) {
      messageDisplay('没有选择联系人');
      return;
    }
    if (active[0] == $('#random-results')[0]) {
      messageDisplay('未添加为联系人');
      return;
    }
    $('.contact-box-checked').trigger('dblclick');
    messageDisplay('只归档第一个选中者');
  });

  // 图标：退出登录
  $('#control-logout').click(function() {

    $("#logout-dialog").dialog({resizable : false, height : 140, modal : true, buttons : {
      "我…我真的……真的要…" : function() {
        $.post('/logout', function(data) {
          if (data.success)
            window.location.href = "/";
        }, 'json');
      },
      '我点错了…' : function() {
        $(this).dialog("close");
      }
    }, show : { effect : 'drop', direction : "up" },
      hide : {effect : "drop", direction : "up"}
    });
  });



  // 加载后执行
  resizeAllInOne();// 重新布局

  if ($('#firstName').val() == '' || $('#lastName').val() == '') {
    accountEditDialog(true);
    setTimeout(function() {
      messageDisplay('你还未填写好你的个人信息，请填写好你的个人信息');
    }, 1000)

  }


}); //end

