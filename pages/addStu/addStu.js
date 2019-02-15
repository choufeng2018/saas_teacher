// pages/addStu/addStu.js
var token = wx.getStorageSync('token');
let app = getApp();
let baseUrl = app.globalData.baseUrl;
var page = 1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    multi_choose: [],
    noResult:false
  },
  inpuName: function (e) {
    var name = e.detail.value;
    this.setData({
      name: name
    })
  },
  searchName: function (e) {
    console.log(e.detail.value);
    var name = e.detail.value;
    var token = wx.getStorageSync('token');
    var that = this;
    wx.showNavigationBarLoading()
    wx.request({
      url: baseUrl + '/api/student/get_member',
      method: 'get',
      header: {
        token: token
      },
      data: {
        page: page,
        username: name
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.hideNavigationBarLoading();
          that.setData({
            items: res.data.data.data
          })
          wx.hideLoading();
        }
      }
    })
  },
  loadList: function (lesson_id) {
    var that = this;
    if (lesson_id == undefined || lesson_id == '' || lesson_id==null){
      var lesson_id='';
      var is_curriculum=2;
    }else{
      var is_curriculum = 1;
    }
    var token = wx.getStorageSync('token');
    wx.request({
      url: baseUrl + '/api/student/get_member',
      method: 'get',
      header: {
        token: token
      },
      data: {
        page: page,
        page_size: 200,
        lesson_id: lesson_id,
        is_curriculum: is_curriculum
      },
      success: function (res) {
        // var statu={"state":0}
        var list = res.data.data.data;
        var muti = that.data.multi_choose;
        wx.hideLoading();

        //当选中学员后返回添加后
        if (muti.length != 0) {
          for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < muti.length; j++) {
              if (list[i].student_id == muti[j].attr_id) {
                list[i].state = 1
              }
              //console.log(muti[j].attr_id)
            }
            //list[i].state=0;

          }
        }


        that.setData({
          items: list
        })
      }
    })
  },
  //更新对象,id为属性id，obj为操作对象
  updateData: function (id, obj, val) {
    for (var i = 0; i < obj.length; i++) {
      var cur_data = obj[i];
      if (cur_data['attr_id'] == id) {
        obj[i] = val;

        return obj;
      }
    }

  },
  //删除对象,id为属性id，obj为操作对象
  deleteData: function (id, obj, val) {
    //alert(name);
    for (var i = 0; i < obj.length; i++) {
      var cur_data = obj[i];
      if (cur_data['attr_id'] == id) {
        obj.splice(i, 1);

        return obj;
      }
    }

  },
  //查询对象,id为属性id，obj为操作对象
  checkData: function (id, obj) {

    //alert(name);
    for (var i = 0; i < obj.length; i++) {
      var cur_data = obj[i];
      if (cur_data['attr_id'] == id) {

        return true;
      }
    }
    return false;
  },

  checks: function (e) {
    var that = this;
    var list = this.data.items;
    var index = e.currentTarget.dataset.key;
    var name = e.currentTarget.dataset.name;
    var data_id = e.currentTarget.dataset.id;
    var avatar = e.currentTarget.dataset.avatar;
    var multi_choose = that.data.multi_choose;
    var choose = {};


    if (list[index].state == 1) {
      list[index].state = 0;

    } else if (list[index].state == 0 || list[index].state === undefined) {
      list[index].state = 1;
    }

    var current_choose = {
      "id": data_id,
      "attr_id": data_id,
      "username": name,
      "avatar": avatar,
      "state": 1
    };

    //判断是否存在当前的属性的id，如果存在则更新，不存在则push新增
    if (that.checkData(data_id, multi_choose)) {

      that.deleteData(data_id, multi_choose, current_choose);
      choose = that.updateData(data_id, multi_choose, current_choose);
    } else {
      multi_choose.push(current_choose);

      choose = multi_choose;
      //console.log(choose)
    }

    that.setData({
      items: list,
      multi_choose: multi_choose,
    })

  },

  reduce: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var multi_choose = this.data.multi_choose;
    var data_id = e.currentTarget.dataset.id;

    multi_choose.splice(index, 1);
    var list = this.data.items;

    for (var i = 0; i < list.length; i++) {
      if (list[i].student_id == data_id) {
        list[i].state = 0;
      }
    }

    that.setData({
      multi_choose: multi_choose,
      items: list
    })
  },
  subAddUser: function (id, students) {
    var token = wx.getStorageSync('token');
    wx.request({
      url: baseUrl + '/api/banji_lesson/add_user',
      method: "POST",
      data: {
        banji_lesson_id: id,
        student_list: students
      },
      header: {
        token: token
      },
      success: function () {
        wx.navigateBack({
          delta: 1
        })

       // console.log('successs')
      }

    })
  },
  add:function(){
    wx.navigateTo({
      url: '../createStu/createStu',
    })
  },
  addStu: function () {
    var multi_choose = this.data.multi_choose;
    var token = wx.getStorageSync('token');
    var practice_id = this.data.practice_id;
    var page_from = this.data.page_from;
    var id = this.data.id;
    var that = this;

    if (multi_choose.length != 0) {
      var stuList = [];
      for (var i = 0; i < multi_choose.length; i++) {
        //muti[i].attr_id.push(stuList)
        stuList.push(multi_choose[i].attr_id)
      }
      var students = stuList.join(',');
    }

    //console.log(page_from);

    if (page_from == 'paikeList') {
      if (multi_choose.length == 0) {
        wx.showToast({
          title: '请选择学员',
          image: '../../images/warn.png'
        })
      } else {
        //console.log(page_from);
        this.subAddUser(id, students);
      }
    }
    if (page_from == undefined) {
      if (multi_choose.length == 0) {
        wx.showToast({
          title: '请选择学员',
          image: '../../images/warn.png'
        })
      } else {
        wx.setStorageSync('addStu', multi_choose);
        wx.navigateBack({
          delta: 1
        })
      }
    }
    //来自发布练习给学生

    // if (practice_id !== undefined) {
    //   var muti = that.data.multi_choose;
    //   var oldStid = [];
    //   for (var i = 0; i < muti.length; i++) {
    //     oldStid.push(muti[i].id);
    //   }

    //   var newStuId=oldStid.join(',');

    //   wx.request({
    //     url: baseUrl + '/api/backend.practice/send_practice',
    //     method: 'post',
    //     header: {
    //       token: token
    //     },
    //     data: {
    //       practice_id: practice_id,
    //       student_id: newStuId
    //     },
    //     success: function(res) {
    //       if (res.data.code == 1) {
    //         wx.showToast({
    //           title: '添加成功',
    //         })
    //         wx.navigateBack({
    //           delta: 1
    //         })
    //       }else{
    //         wx.showToast({
    //           title: res.data.msg,
    //           image:'../../images/warn.png'
    //         })
    //       }
    //     }
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var practice_id = options.practice_id;
    var page_from = options.page_from;
    var lesson_id = options.lessonId;
    
    wx.showLoading({
      title: '正在加载中',
    })

    if (page_from == 'paikeList') {
      this.setData({
        id: options.id,
        page_from: 'paikeList'
      })
    }

    // console.log(practice_id);
    // if (practice_id !== undefined) {
    //   this.setData({
    //     practice_id: practice_id
    //   })
    // }

    var muti = wx.getStorageSync('addStu');
    if (muti) {
      that.setData({
        multi_choose: muti
      })
    }
    this.loadList(lesson_id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})