var Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

 
    // --------------------------------
    // -------------时间---------------
    var CURRENT_TIME = (function(_date) {
      var _date = new Date();
      var	_year = _date.getFullYear(),
        // 加1后为中国月份单位
        _month = _date.getMonth() + 1,
        _day = _date.getDate(),
        _hour = _date.getHours(),
        _minute = _date.getMinutes(),
        _second = _date.getSeconds();
        if(_month < 10){_month = "0" + _month;}
        if(_day < 10){_day = "0" + _day;}
        if(_hour < 10){_hour = "0" + _hour;}
        if(_minute < 10){_minute = "0" + _minute;}
        if(_second < 10){_second = "0" + _second;}
      return {
        "timestamp": _date,
        "yearMonthDay": _year + "-" + _month + "-" + _day,
        "minuteSeconde": _hour + ":" + _minute,
        "fullDate": _year + "-" + _month + "-" + _day + " " + _hour + ":" + _minute + ":" + _second
      }
    })();
    //-----------------获取我的信息---------------
    function getMyInfoById(){
      $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1/my/userinfo',
        beforeSend: function (XMLHttpRequest) {
          XMLHttpRequest.setRequestHeader("Authorization", localStorage.getItem('token'));
          },
        success: function (res) {
          console.log(res);
          $('.widget-user-username').text(res.data.username)
          $('#my_credits').text(res.data.credits)
          localStorage.setItem('userType',res.data.user_type)
          if(res.data.user_type === '1'){
          $('#user_type').text('普通用户')
          $('#userOp').css('display','none')
          $('#postGoodsBtn').css('display','none')
          }else if(res.data.user_type === '2'){
          $('#user_type').text('商家')
          $('#userOp').css('display','none')
          }else if(res.data.user_type === '3'){
          $('#user_type').text('管理员')
          }else{
          $('#user_type').text('未知')
        }
        }
      })
    }
    //-----------------搜索函数---------------
    function getGoodsInfoByKeyWords(){
      $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1/my/article/goods/?keywords='+ $('#search_content').val(),
        beforeSend: function (XMLHttpRequest) {
          XMLHttpRequest.setRequestHeader("Authorization", localStorage.getItem('token'));
          },
          success: function (res) {
            console.log(res);
            var rows = []
            $.each(res.data, function (i, item) {
              rows.push(`<div class="col mb-4">
              <div class="card h-100">
              <img src="./img/cover.webp.jpg" class="card-img-top" alt="...">
              <a href="JavaScript:;" class="badge badge-secondary rounded-0" onclick="getGoodsInfo(${item.id})">查看详情</a>
             <div class="card-body">
            <h6 class="card-title">${item.title}</h6>
            <p class="card-text text-warning">￥${item.price}</p>
             </div>
             <div class="card-footer d-flex justify-content-between">
              <a href="#" class="badge badge-primary ${userType === '3' ? '' : 'd-none'}" id="edit" onclick="editgetGoodsInfo(${item.id})">编辑</a>
              <a href="#" class="badge badge-danger ${userType === '3' ? '' : 'd-none'}" id="delete" onclick="deleteGoods(${item.id})">删除</a>
              <a href="#" class="badge badge-warning" onclick="getGoodsInfo(${item.id})">立即购买</a>
              </div>
            </div>
            </div>`)
            })
            $('#goodsList').empty().append(rows.join(''))
          }
      })

    }
    //-----------------获取我的订单信息数量---------------
    function getUserOrderNumInfo(){
      $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1/my/userorderNuminfo',
        beforeSend: function (XMLHttpRequest) {
          XMLHttpRequest.setRequestHeader("Authorization", localStorage.getItem('token'));
          },
          success: function (res) {
          console.log(res);
          $('#my_buys').text(res.data[0].ordersnum)
        }
      })
    }
    //-----------------获取我的评价信息数量---------------
    function getUserReviewsNumInfo(){
      $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1/my/userreviewsnuminfo',
        beforeSend: function (XMLHttpRequest) {
          XMLHttpRequest.setRequestHeader("Authorization", localStorage.getItem('token'));
          },
          success: function (res) {
          console.log(res);
          $('#my_rate').text(res.data[0].reviewsnum)
        }
      })
    }
    //---------------登录----------------
    $('#lgbtnPOST').on('click', function () {
      if ($('#username').val() === '') {
        $('.login-box-msg').text('请输入账号！').css({'color':'red'})
      }else if($('#password').val() === ''){
        $('.login-box-msg').text('请输入密码！').css({'color':'red'})
      }else{
      $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1/api/login',
        data: {
          username: $('#username').val(),
          password: $('#password').val(),
          last_login:CURRENT_TIME.fullDate
        },
        success: function (res) {
          console.log(res)
          if (res.status === 1) {
          $('.login-box-msg').text(res.message).css({'color':'red'})
          }else{
          $('.login-box-msg').text(res.message).css({'color':'green'})
          localStorage.setItem('token',res.token)
          localStorage.setItem('userinfo',JSON.stringify(res.cuserinfo))
          window.location.href="index.html";
        }
        }
      })
    }
  //---------------发布商品----------------
  $('#pgbtnPOST').on('click', function () {
    if ($('#goods_name').val() === '') {
      Toast.fire({
        icon: 'error',
        title: '请输入标题'
      })
    }else if($('#goods_price').val() === ''){
      
      Toast.fire({
        icon: 'error',
        title: '请输入价格'
      })
    }else{
    let fd = new FormData()
    fd.append('title', $('#goods_name').val())
    fd.append('cate_id', $('#goods_cate').val())
    fd.append('price', $('#goods_price').val())
    fd.append('content', $('#goods_content').val())
    fd.append('state', $('input[name=goods_status]:checked').val())
    fd.append('pub_date', CURRENT_TIME.fullDate)
    fd.append('cover_img', $('#goods_cover')[0].files[0])
    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1/my/article/add',
      beforeSend: function (XMLHttpRequest) {
        XMLHttpRequest.setRequestHeader("Authorization", localStorage.getItem('token'));
        },
      contentType : false, 
			processData : false,
      data: fd,
      success: function (res) {
        console.log(res)
        if (res.status === 0) {
          window.location.href="index.html"
        }
      }
    })
  }
})
  //----------------注册----------------
    $('#rgbtnPOST').on('click', function () {
      if ($('#username').val() === '') {
        $('.login-box-msg').text('请输入账号！').css({'color':'red'})
      }else if($('#password').val() === ''){
        $('.login-box-msg').text('请输入密码！').css({'color':'red'})
      }else if($('#tel').val() === ''){
        $('.login-box-msg').text('请输入手机号码！').css({'color':'red'})
      }else if($('#repwd').val() === ''){
        $('.login-box-msg').text('请输入重复密码！').css({'color':'red'})
      }else if($('#password').val() !== $('#repwd').val()){
        $('.login-box-msg').text('两次输入的密码不一致！').css({'color':'red'})
      }else{
      $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1/api/reguser',
        data: {
          username: $('#username').val(),
          email: $('#email').val(),
          password: $('#password').val(),
          register_at:CURRENT_TIME.fullDate,
          user_type:$('#user_type').val()
        },
        success: function (res) {
          console.log(res)
          if (res.status === 1) {
          $('.login-box-msg').text(res.message).css({'color':'red'})
          }else{
          $('.login-box-msg').text(res.message).css({'color':'green'})
          window.location.href="login.html";
        }
        }
      })
    }
    })
  })

  function clearLocalStroge(){
    localStorage.clear()
    window.location.href = '../login.html'
  }

