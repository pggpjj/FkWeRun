// pages/resign/resign.js

var Server = require("../../service/Server.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus2: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //分享
    wx.showShareMenu({
      withShareTicket: true
    });

    this.setData({
      resignCount: app.globalData.globalUserInfo.resigncount
    });

    //获取补卡数据
    Server.redoCalendarData(res=>{
      this.setData({
        resignDates: res.data.resignDates
      });
    });
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
    var imageUrl = app.RES_URL + "banner.png?t=" + app.REFRESH_V;
    return {
      title: "[有人@我]，好友邀请你每天10000步打卡",
      imageUrl: imageUrl,
      path: "/pages/index/index",
      success: res => {
        //分享成功，判断是不是微信群
        if (res.shareTickets && res.shareTickets.length > 0) {
          if (app.globalData.globalUserInfo.resigncount == null) {
            app.globalData.globalUserInfo.resigncount = 0;
          }
          //更新补签次数
          Server.updateSigncount(app.globalData.openid, res => {
            if (res.data.success) {
              app.globalData.globalUserInfo.resigncount += 1;
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '获取1次补卡机会，快去补卡吧',
                success: function (res) {
                }
              });
              this.setData({
                showModalStatus2: false,
                resignCount: app.globalData.globalUserInfo.resigncount
              });
            } else {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '服务器错误',
                success: function (res) {
                }
              });
            }

          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '分享到群获取补卡机会',
            success: function (res) {
            }
          });

        }
      }
    }
  }

})