$(function () { 
  $('#link_login').on('click', function () { 
   $('.login').hide()
    $('.reg').show()
  })
  $('#link_reg').on('click', function () { 
    $('.reg').hide()
     $('.login').show()
  })

  // 表单验证
  // 从layui中获取form对象
  let form = layui.form
  let layer = layui.layer
  form.verify({
  username: function(value, item){ //value：表单的值、item：表单的DOM对象
    if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
      return '用户名不能有特殊字符';
    }
    if(/(^\_)|(\__)|(\_+$)/.test(value)){
      return '用户名首尾不能出现下划线\'_\'';
    }
    if(/^\d+\d+\d$/.test(value)){
      return '用户名不能全为数字';
    }
    
    //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
    if(value === 'xxx'){
      alert('用户名不能为敏感词');
      return true;
    }
  }
  
  //我们既支持上述函数式的方式，也支持下述数组的形式
  //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
  ,pwd: [
    /^[\S]{6,12}$/
    ,'密码必须6到12位，且不能出现空格'
    ],
    repwd: function (value) {
    // value拿到的是用户输入的值
    // 必须拿到密码框中的值
      // 两次值进行一次相等的判断
      // 如果不相等则返回一个值
      let pwd = $('.reg [name=password]').val()
      if (pwd != value) {
        return '两次输入的密码不相等'
      }
  }
  })
  
  // 监听注册表单的提交事件
  $('#form-reg').on('submit', function (e) {
    let data = { username: $('#form-reg [name=username]').val(), password: $('#form-reg [name=password]').val() }
    e.preventDefault()
    $.post('http://big-event-api-t.itheima.net/api/reguser',data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg('注册成功');
      $('#link_reg').click()
    })

  })

  //监听登录表单的提交事件
  // $('#form-login').on('submit', function (e) {
  //   e.preventDefault()
  //   let data = { username: $('#form-reg [name=username]').val(), password: $('#form-reg [name=password]').val() }
  //   $.post('http://big-event-api-t.itheima.net/api/login', data, function (res) {
  //     if (res.status !== 0) {
  //       return layer.msg(res.message);
  //     }
  //      layer.msg('登录成功');
  //   })
  //  })
  $('#form-login').submit(function (e) {
    e.preventDefault()
    $.ajax({
      url:'http://big-event-api-t.itheima.net/api/login',
      method: 'POST',
      data: $(this).serialize(),   //快速获取表单中的数据
      success: function (res) {
         if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg('登录成功')
        // 将token字符串存储到localstorage中，要的时候就从中拿就是
        localStorage.setItem('token',res.token)
        // 登录成功后就跳转到首页
        location.href = '/index.html'; 
      }
      
    })

  })

})