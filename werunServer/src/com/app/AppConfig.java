package com.app;

/**
 * app全局配置
 */
public enum AppConfig {

	/**
	 * 小程序的appid和appsecret配置
	 * appid和appsecret在小程序后台》开发》开发管理中获取
	 */
	DAKA("your-appid", "your-appid", "your-appsecret");
	
	private String serverId;
	private String appId;
	private String appSecret;
	
	
	private AppConfig(String serverId, String appId, String appSecret) {
		this.serverId = serverId;
		this.appId = appId;
		this.appSecret = appSecret;
	}

	public static String getAppId(String serverId) {
		if (AppConfig.DAKA.getServerId().equals(serverId)) {
			return AppConfig.DAKA.getAppId();

		}

		return null;
	}

	public static AppConfig getInstance(String serverId) {
		if (AppConfig.DAKA.getServerId().equals(serverId)) {
			return AppConfig.DAKA;
		}

		return null;
	}

	public static AppConfig getInstanceByAppid(String appId) {
		if (AppConfig.DAKA.getAppId().equals(appId)) {
			return AppConfig.DAKA;
		}

		return null;
	}

	public String getServerId() {
		return serverId;
	}

	public String getAppId() {
		return appId;
	}

	public String getAppSecret() {
		return appSecret;
	}
	
}
