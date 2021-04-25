package com.app.daka.dao;

import java.util.List;

import com.app.daka.domain.Userinfo;

public interface UserinfoDao {
	
	public List<Userinfo> queryTodayRank();
	
	public List<Userinfo> queryMonthRank();

	public List<Userinfo> queryAllRank();
	
	public void resetTodayStep();
	
	public void resetMonthStep();
	
	public Userinfo getByOpenid(String openid);

	public void create(Userinfo entity);

	public void update(Userinfo entity);
	
	public void updateUserinfoByOpenid(Userinfo userinfo);

	public void delete(Userinfo entity);
	
}

