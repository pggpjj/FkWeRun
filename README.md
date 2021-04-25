# 微信步数打开小程序+后端Javaweb

    版权归 jeeweixin.com 所有
    转载请注明出处，授权请联系微信公众号coder10


## 功能说明:
* 1、获取和展示用户的微信运动步数，计算卡路里；

* 2、用户打开小程序即可实现步数打卡入库；

* 3、通过日历展示用户的总数据；

* 4、详情见最下方项目截图；


## 使用说明：
* 一、环境说明
    - 1.1、开发工具：服务端Eclipse、IntellJ都可以、客户端使用微信小程序开发工具
    - 1.2、需要环境：JDK1.8+、MySql5.5+、Tomcat8+


* 二、项目说明
    - 1.1、需要注册一个微信小程序，并取得appid和appsecret
    - 1.2、werunServer是Java web项目，werunClient是小程序项目
    - 1.3、werunServer需要修改
        - 1.3.1、AppConfig.java 中的appid和appsecret配置
        - 1.3.2、创建一个数据库（如werun），并执行项目中的init.sql文件
        - 1.3.3、修改jdbc.properties，使werunServer可以连接到数据库
        - 1.3.4、配置到tomcat中启动，访问 xxx/test.htm ，如果访问成功，说明启动ok

    - 1.4、werunClient需要修改
        - 1.4.1、修改app.js文件中的appid和URL
        - 1.4.2、修改project.config.json中的appid

    - 1.5、视频教程参考：

    - 1.6、遇到问题可关注微信公众号 `coder10`，回复 `进群` 即可参与讨论


* 三、项目功能截图

（仅供参考）

    今日步数

![image](https://github.com/qilaosi/FkWeRun/blob/master/images/2.png)

    当月步数

![image](https://github.com/qilaosi/FkWeRun/blob/master/images/3.png)

    小程序代码结构（werunClient）

![image](https://github.com/qilaosi/FkWeRun/blob/master/images/4.png)

    后端代码结构 （werunServer）

![image](https://github.com/qilaosi/FkWeRun/blob/master/images/5.png)

    微信开发者工具 

![image](https://github.com/qilaosi/FkWeRun/blob/master/images/1.png)


---
##### 程序员祁老司

* 公众号：coder10 
分享视频教程、项目源码、面试笔试题、毕业设计、开发工具、行业经验分享
* 个人网站：
www.coder10.net 
* B站：https://space.bilibili.com/305587632

