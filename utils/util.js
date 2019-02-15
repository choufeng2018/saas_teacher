//初始化  

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// let token = wx.getStorageSync('token');
//const host = 'https://jiaowu.11taotao.com/api/v1.';
const host = 'https://d.saas.kuaipeilian.com/api/'
//const host = 'https://saas.kuaipeilian.com/api/'
//const host ='https://t.saas.kuaipeilian.com'
//console.log(token)


//请求封装
function request(url, method, data, token) {
  wx.showNavigationBarLoading();

  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url, //仅为示例，并非真实的接口地址
      method: method,
      data: data,
      header: {
        token: token
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        resolve(res.data)
      },
      fail: function (error) {
        wx.hideNavigationBarLoading();
        reject(false)
      },
      complete: function () {
        wx.hideNavigationBarLoading();
      }
    })
  })
}

var _get = function (url, data, token) {
  return request(url, 'GET', data, token)
}
var _post = function (url, data, token) {
  return request(url, 'POST', data, token)
}

var sub = function (val) {
  if (val.length == 0 || val == undefined) {
    return;
  }
  if (val.length > 17) {
    return val.substring(0, 17) + "...";
  } else {
    return val;
  }
}

//多张图片上传
const uploadimg= function (data) {
  var picboxs=[];
  var that = this;
  var that = this,
    i = data.i ? data.i : 0,//当前上传的哪张图片
    success = data.success ? data.success : 0,//上传成功的个数
    fail = data.fail ? data.fail : 0;//上传失败的个数
  wx.uploadFile({
    url: data.url,
    filePath: data.path[i],
    name: 'file',//这里根据自己的实际情况改
    formData: null,//这里是上传图片时一起上传的数据
    success: (resp) => {
      success++;//图片上传成功，图片上传成功的变量+1
      var Tojson = JSON.parse(resp.data);
      var that = this;
      if (Tojson.code == 1 || Tojson.code == 200) {
        
        var avatar = Tojson.data.url;
        picboxs.push(avatar);
        console.log(picboxs)
        // that.setData({
        //   picboxs: picboxs
        // })
      }
      
      
      //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
    },
    fail: (res) => {
      fail++;//图片上传失败，图片上传失败的变量+1
      console.log('fail:' + i + "fail:" + fail);
    },
    complete: () => {
      console.log(i);
      i++;//这个图片执行完上传后，开始上传下一张
      if (i == data.path.length) {   //当图片传完时，停止调用          
        console.log('执行完毕');
        console.log('成功：' + success + " 失败：" + fail);
      } else {//若图片还没有传完，则继续调用函数
        console.log(i);
        data.i = i;
        data.success = success;
        data.fail = fail;
        that.uploadimg(data);
      }

    }
  });
}

const buttonClicked=function (self) {
  self.setData({
    buttonClicked: true
  })
  setTimeout(function () {
    self.setData({
      buttonClicked: false
    })
  }, 500)
}




const ages= function(str) {
  var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
  if (r == null) return false;
  var d = new Date(r[1], r[3] - 1, r[4]);
  if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
    var Y = new Date().getFullYear();
    return ((Y - r[1]));
  }
  //return ("输入的日期格式错误！");
}   
//newVersion

module.exports = {
  uploadimg: uploadimg,
  formatTime: formatTime,
  host,
  get: _get,
  post: _post,
  sub:sub,
  ages: ages,
  click:buttonClicked
}