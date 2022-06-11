$(function () {
    let layer = layui.layer
    getCartList()
    // 获取文章分类的列表
    function getCartList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                let htmltr = template('tpl_cart', res)
                $('[name=cate_id]').html(htmltr)
                layui.form.render()
            }
        })
    }
    // 初始化富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为发布按钮绑定点击事件
    $('#btn-send').on('click', function () {
        $('#coverFile').click()
    })

    $('#coverFile').on('change', function (e) {
        let files = e.target.files
        if (files.length === 0) {
            return
        }
        let newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    let art_state = '已发布'
    // 为存为草稿按钮绑定点击事件
    $('#btn_save2').on('click', function () {
        art_state = '草稿'
    })

    //为表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        let fd = new FormData($(this)[0])
        //将文章的发布状态存到fd中
        fd.append('state', art_state)
        //将封面裁剪过后的图片，输出一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象，存到fd中
                fd.append('cover_img', blob)
                // 发起ajax请求
                publishArticle(fd)
            })

    })
    // 定义一个发布文章的方法
    function publishArticle(data) { 
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: data,
            contentType: false,
            processData:false,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('发布文章失败')
                }
                layui.layer.msg('发布文章成功')
                location.href='/article/art_list.html'
            }
        })
    }

})