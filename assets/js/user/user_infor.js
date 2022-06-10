$(function () {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.value < 6) {
                return '昵称的长度必须大于6'
            }
        }
    })
    initUserinfo()
    // 初始化用户的信息
    function initUserinfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                console.log(res);
                form.val('formUserInfor',res.data)
            }
        })
    }

    // 为重置按钮绑定点击事件
    $('.btnRest').on('click', function (e) { 
        e.preventDefault()
        initUserinfo()
    })
    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户的信息失败')
                }
                layer.msg('修改用户的信息成功')
                // 调用父页面的方法重新渲染头像
                window.parent.getUserInfor()
            }
        })
     })
})