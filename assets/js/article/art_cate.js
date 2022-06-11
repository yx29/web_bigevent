$(function () {
    let layer = layui.layer
    let form = layui.form
    // 获取文章的列表
    function initArtCartList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    initArtCartList()
    let addIndex = null
    // 为添加类别绑定添加事件
    $('#btnAddCate').on('click', function () {
        addIndex = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialogAdd').html()
        })
    })
    // 通过代理的形式，为表单绑定submit提交事件
    $('body').on('submit', '.layui-form', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $('.layui-form').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                initArtCartList()
                layer.msg('新增文章分类成功！')
                // 根据索引关闭对应的弹出层
                layer.close(addIndex)
            }
        })
    })
    // 通过代理的形式为编辑按钮绑定点击事件
    let indexEdit = null
    $('tbody').on('click', '#btn-edit', function () {

        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#mod-Article').html()
        })
        // 获取自定义属性
        let id = $(this).attr('data-id')
        console.log(id);
        // 发起请求获取分类的信息
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res);
                form.val('form-modf', res.data)
            }
        })


    })
    // 通过代理的形式为修改文章的表单绑定表单提交事件
    $('body').on('submit', '#form-modf', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新文章失败')
                }
                // 关闭弹出层
                layer.close(indexEdit)
                initArtCartList()
                // 更新文章列表

                // 提示用户更新文章成功
                layer.msg('更新文章成功')
            }
        })
    })
    // 删除文章
    $('tbody').on('click', '#btn-del', function () {
        let id = $(this).attr('data-id')
        console.log(id);
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    initArtCartList()
                    layer.msg('删除文章成功')
                }
            })

            layer.close(index);
        });
    })


})