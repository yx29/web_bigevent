$(function () { 
    getUserInfor()
    // 点击按钮实现退出功能
    $('#btnLogout').on('click', function () { 
        let layer=layui.layer
        // 弹出提示框
        layer.confirm('确认退出登录？', {icon: 3, title:'提示'}, function(index){
        //do something
        // 1.清空本地的存储的token
            localStorage.removeItem('token')
        //2.重新跳转到登陆界面
            location.href='/login.html'
        layer.close(index);
        });
    })
})
// 获取用户信息
function getUserInfor() { 
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 是请求头对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
            
        // },
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // // 调用函数渲染用户头像
            renderAvatar(res.data)
        },
        // 无论请求成功或者失败都调用complete函数
        // complete: function (res) {
        //     // 在complate函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        //     // console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message=== '身份认证失败！'){
        //         //强制清空token
        //         localStorage.removeItem('token')
        //         //强制跳转到首页
        //         location.href='/login.html'
        //     }
        // }
    })
}

function renderAvatar(user) {
    // 获取用户的名称
    let name = user.nickname || user.username
    
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()

    } else {
        // 渲染文字头像
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
         $('.text-avatar').html(first).show()
    }
}