$(function () {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            // value拿到的是用户输入的值
            // 必须拿到密码框中的值
            // 两次值进行一次相等的判断
            // 如果不相等则返回一个值
            let pwd = $('[name=requirePassword]').val()
            if (pwd != value) {
                return '两次输入的密码不相等'
            }
        },
        samePwd: function (value) {
            let pwd = $('[name=oldPassword]').val()
            if (pwd === value) {
                return '原密码不能与新密码相同'
            }
        }
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败！')
                }
                layer.msg('更新密码成功！')
                $('.layui-form')[0].reset()
            }
        })
    })
})