$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 实现文件上传
    $('.btnChooseImage').on('click', function () {
        $('[name=file]').click()
    })
    //为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        let fileList = e.target.files
        if (fileList.length === 0) {
            return layui.layer.msg('请选择上传的文件')
        }
        // 拿到用户选择的文件
        let file = e.target.files[0]
        // 根据选择的文件，创建一个对应的 URL 地址
        let newImgURL = URL.createObjectURL(file)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    $('.btnUpload').on('click', function () {
        // 要拿到用户上传的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 把头像上传到服务器中
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar:dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新头像失败')
                }
                layui.layer.msg('更新头像成功')
                // 渲染用户的头像
                window.parent.getUserInfo()
            }
        })
    })
})