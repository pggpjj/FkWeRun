//app.js
var util = require("./utils/util.js");
var V = "1.2"; //版本

App({
  //服务器的appid，必须修改成自己的小程序appid
  SERVER_APP_ID: "your-appid",

  //服务器地址
  HTTP_SERVER: "http://localhost:8080/werunServer",
  RES_URL: "http://localhost:8080/werunServer/static/images/daka/",

  // HTTP_SERVER: "http://jeeweixin.com/",
  // RES_URL: "http://jeeweixin.com/static/images/daka/",
  
  //缓存
  REFRESH_V: "1.2",
  CACHE_PREFIX: "DAKA_",
  
  globalData: {
    userInfo: {}
  },

  //小程序启动加载
  onLaunch: function () {

  },

  onHide: function () {

  },

  //获取用户信息
  getUserInfo: function (cb) {
    if (this.globalData.openid) {//已经登录，获取用户基本信息
      cb(this.globalData.userInfo);
    } else {
      // 登录，获取用户openid
      wx.login({
        success: res => {
          //从开发服务器获取openid
          var code = res.code;
          this.jscode2session(code, cb);
        }
      });
    }
  },

  //从服务器端获取openid，如果用户存在则获取用户信息
  jscode2session: function (code, cb) {
    var cb_flag = false;
    wx.request({
      url: this.HTTP_SERVER + 'wechat/daka/jsession/',
      data: {
        serverAppId: this.SERVER_APP_ID,
        jscode: code
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        //处理数据
        this.globalData.userInfo = {};
        this.prepareGlobalData(res.data);
        //回调
        cb_flag = true;
        if (typeof cb === "function") {
          cb(this.globalData.userInfo);
        }
      },

      fail: function (res) {
        console.log("jscode2session fail");
      },
      //完成一定会执行
      complete: res => {

      }
    });
  },

  prepareGlobalData: function (resData) {
    var userInfo = resData.userInfo;
    this.globalData.openid = resData.openid;//判断用户是否登录
    this.globalData.userInfo = userInfo;//用户信息
    //总挑战次数
    this.globalData.totalFightCount = resData.version.njctotalfight;
  },

  //重新绑定用户信息
  rebindUserInfo: function (res, cb) {
    var userInfo = res.detail.userInfo;
    if (userInfo) {
      this.globalData.userInfo.avatarUrl = userInfo.avatarUrl;
      this.globalData.userInfo.nickName = userInfo.nickName;
      this.globalData.userInfo.province = userInfo.province;
      if (typeof cb === "function") {
        cb();
      }
    } else {
      wx.showToast({
        title: '授权失败',
        mask: true,
        image: '../../images/error.png?t=1'
      });
    }
  },

  //根据授权获取用户信息
  getScopeUserInfo: function (cb) {
    var openid = this.globalData.userInfo.openid;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              var userInfo = res.userInfo;
              userInfo.openid = openid;
              //已经授权
              cb(userInfo);
            }
          });
        } else {
          cb(null);
        }
      }
    })
  },

  //获取当前版本号
  getVersion: function () {
    return V;
  },

  //成语的缓存 getter & setter
  getLocalStorage: function (key) {
    key = this.CACHE_PREFIX + V + key;
    return wx.getStorageSync(key);
  },

  //设置缓存
  setLocalStorage: function (key, value) {
    key = this.CACHE_PREFIX + V + key;
    wx.setStorageSync(key, value);
  },

  //删除缓存
  removeLocalStorage: function (key) {
    key = this.CACHE_PREFIX + V + key;
    wx.removeStorage({
      key: key,
      success: function (res) { },
    })
  },

  //获取缓存中今天的缓存
  getTodayStorage: function (key) {
    var dateStr = util.getDateStr(new Date());
    key = this.CACHE_PREFIX + V + key + "_" + dateStr;
    return wx.getStorageSync(key);
  },

  //重置缓存中的今天缓存
  setTodayStorage: function (key, value) {
    var dateStr = util.getDateStr(new Date());
    key = this.CACHE_PREFIX + V + key + "_" + dateStr;
    wx.setStorageSync(key, value);
  },


})
