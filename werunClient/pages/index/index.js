// pages/daka/daka.js
var Calendar = require("../../service/Calendar.js");
var Server = require("../../service/Server.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDaKaBtn: false,
    bannerbg: app.RES_URL + "banner.png?t=" + app.REFRESH_V,
    mystepTitle: "今日步数"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //分享
    wx.showShareMenu({
      withShareTicket: true
    });

    wx.showLoading({
      title: '数据加载中...',
    });

    wx.login({
      success: res => {
        var code = res.code;//code
        wx.getWeRunData({
          success: res=> {
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            Server.encryptWeRunData(encryptedData, iv, code, res => {
              console.log(res.data)
              app.globalData.openid = res.data.openid;
              var userinfo = res.data.userinfo;
              app.globalData.globalUserInfo = userinfo;
              var totalPeopleCount = 100;
              var version = res.data.version;
              if (version){
                app.REFRESH_V = version.version;
                totalPeopleCount = version.totalpeople;
              }
              //计算卡路里
              var mystep = parseInt(res.data.step);
              var k = 0.8214;
              var weight = parseInt(userinfo.weight);//kg
              var height = parseInt(userinfo.height);//cm

              var stepWidth = height * 0.48 / 100; //步幅，米
              var caloris = weight * mystep / 1000 * stepWidth * k;
              var km = (stepWidth * mystep / 1000).toFixed(2); //公里
              this.setData({
                showDaKaBtn: true,
                totalPeopleCount: totalPeopleCount,
                mystep: mystep,
                caloris: caloris.toFixed(2),
                km: km
              });

              //画图
              this.drawerStepCanvas();

            });
          }
        });
      }
    });
    
  },

  //上传步数
  uploadStep: function(){
    var openid = app.globalData.openid;
    var step = this.data.mystep;
    var kms = this.data.km;
    var caloris = this.data.caloris;

    var title = "";
    
    wx.showLoading({
      title: '数据上传中...',
    });
    //上传用户打卡数据
    wx.getUserInfo({
      success: res => {
        var userInfo = res.userInfo;
        app.globalData.userInfo = userInfo;//微信接口用户信息
        
        //登录
        wx.login({
          success: res => {
            var code = res.code;//code
            wx.getWeRunData({
              success: res => {
                var iv = res.iv;
                var encryptedData = res.encryptedData;
                Server.doDaka(step, encryptedData, iv, code, kms, caloris, res => {
                  app.globalData.globalUserInfo = res.data.user;
                  this.setData({
                    mystepTitle: title
                  });
                });
              }
            });
          }
        });

      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 根据步数画图
   */
  drawerStepCanvas: function(){
    var winWidth = wx.getSystemInfoSync().windowWidth;
    ////创建并返回绘图上下文context对象
    var cxt_arc = wx.createCanvasContext('canvasArc');
    cxt_arc.beginPath();

    //计时器
    this.clearTimeInterval();//清除计时器
    //var mystep = 10000;
    var mystep = this.data.mystep;
    var that = this;
    var minPercent = Math.PI * 0.5;
    var maxPercent = Math.PI * (0.5 + (mystep / 10000) * 2);
    if (maxPercent > Math.PI * 2.5) {
      maxPercent = Math.PI * 2.5;
    }
    var curPercent = minPercent;
    var inter_id = setInterval(function () {
      if (curPercent >= maxPercent) {
        that.clearTimeInterval();
        that.setData({
          scalecls: "scale-cls"
        });
      } else {
        curPercent += 0.1;
        cxt_arc.setStrokeStyle('#40d07f');
        cxt_arc.setLineWidth(7);
        cxt_arc.setLineCap('round')
        cxt_arc.arc(105, 98, 88, minPercent, curPercent, false);
        cxt_arc.stroke();
        cxt_arc.draw();
      }
    }, 30);
    app.globalData.time_inter_ids.push(inter_id);//计时器数组
  },

  //清除所有计时器
  clearTimeInterval: function () {
    var ids = app.globalData.time_inter_ids;
    if (ids && ids.length > 0) {
      for (var i = 0; i < ids.length; i++) {
        clearInterval(ids[i]);
      }
    }
    app.globalData.time_inter_ids = [];
  },

  //清除某个计时器
  clearTimeIntervalById: function (inteId) {
    var ids = app.globalData.time_inter_ids;
    if (ids && ids.length > 0 && inteId) {
      for (var i = 0; i < ids.length; i++) {
        if (inteId == ids[i]){
          clearInterval(ids[i]);
        }
      }
    }
  },

  /**
   * 帮助
   */
  tohelp: function () {
    wx.navigateTo({
      url: '/pages/help/help'
    })
  },

  /**
   * 我的主页
   */
  tohome: function () {
    wx.navigateTo({
      url: '/pages/home/home'
    })
  },

  /**
   * 补打卡
   */
  redo: function(){
    wx.navigateTo({
      url: '/pages/resign/resign'
    })
  },

  /**
   * 排行页
   */
  torank: function () {
    wx.navigateTo({
      url: '/pages/rank/rank'
    })
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
    var imageUrl = app.RES_URL + "banner.png?t=" + app.REFRESH_V;
    return {
      title: "[有人@我]，好友邀请你每天10000步打卡",
      imageUrl: imageUrl,
      path: "/pages/index/index",
      success: res => {
        
      }
    }
  }


})