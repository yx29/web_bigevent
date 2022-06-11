$(function () {
    let laypage = layui.laypage
    let layer = layui.layer
    // 定义一个查询对象，当服务器发起请求的时候，就把参数提交给服务器中
    let q = {
        pagenum: 1, //页码值 默认请求第一页的数据
        pagesize: 2, //每页显示多少条数据，默认现实两条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态
    }
    initTableList()
    initCate()
    // 定义一个美化时间的过滤器函数
    template.defaults.imports.dataFormate = function (date) {
        const dt = new Date(date)

        let y = dt.getFullYear()
        let m = dt.getMonth() + 1
        m = m < 10 ? m + '0' : m
        let d = dt.getDate()
        d = d < 10 ? d + '0' : d

        let hh = dt.getHours()
        hh = hh < 10 ? hh + '0' : hh
        let mm = dt.getMinutes()
        mm = mm < 10 ? mm + '0' : mm
        let ss = dt.getSeconds()
        ss = ss < 10 ? ss + '0' : ss
        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss

    }

    //获取文章列表数据
    function initTableList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章列表数据失败')
                }
                // 定义模板引擎
                let htmlStr = template('tableList', res)
                $('tbody').html(htmlStr)
                // 调用获取分页的方法
                renderPage(res.total)
            }

        })
    }


    // 获取文章分类别表
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类列表失败')
                }
                // console.log(res.data);
                // 定义模板结构
                let htmlStr = template('cateList', res)
                $('[name=cate_id]').html(htmlStr)
                // 通知layui重新渲染表单的ui结构
                layui.form.render()
            }
        })
    }


    // 筛选表单绑定submit提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取选中状态的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 把值填充到q对应的选项中
        q.cate_id = cate_id
        q.state = state
        // 重新渲染表格的数据
        initTableList()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //指定默认渲染那一页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 触发jump回调的两种方法
            // 1.点击页码值就会触发jump回调
            // 2.只要渲染了laypage.render()就会触发jump回调
            jump: function (obj, first) {
                //可以通过first的值来得到是何种方式触发的jump回调
                //如果first的值为true就是第二种方式触发的，否则就是第一种方式
                // 如果是第二种方式触发的就不要调用initTableList()，如果是第一种就调用initTableList()
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr //把得到的当前页复制给对象q
                q.pagesize = obj.limit //把得到的当前条目数赋值给对象q
                // 根据最新的q渲染表格数据
                if (!first) {
                    initTableList()
                }
            }


        })
    }

    // 通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click', '#btn-del', function () {
        //获取删除按钮的个数
        let length = $('#btn-del').length()
        layer.confirm('确定要删除吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            let id = $('#btn-del').att('data-id')
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    // 当数据删除完成之后，要判断当前的页面是否还有数据，
                    // 如果没有数据了，就让页码值减一
                    //再调用initTableList()
                    if (length === 1) {
                        // 如果当前的length等于1，说明删除数据之后页面就没有数据了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTableList()
                }
            })

            layer.close(index);
        });
    })

})