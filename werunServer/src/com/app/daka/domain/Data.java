package com.app.daka.domain;

public class Data {
	
	private Long id;
	private String openid;//
	private Integer year;//
	private Integer month;//
	private Integer kdate;//
	private Integer steps;//
	private Double kms;//
	private Double caloris;//

	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getOpenid(){
		return openid;
	}
	public void setOpenid(String openid){
		this.openid = openid;
	}

	public Integer getYear() {
		return year;
	}
	public void setYear(Integer year) {
		this.year = year;
	}
	public Integer getMonth() {
		return month;
	}
	public void setMonth(Integer month) {
		this.month = month;
	}
	public Integer getKdate() {
		return kdate;
	}
	public void setKdate(Integer kdate) {
		this.kdate = kdate;
	}
	public Integer getSteps() {
		return steps;
	}
	public void setSteps(Integer steps) {
		this.steps = steps;
	}
	public Double getKms(){
		return kms;
	}
	public void setKms(Double kms){
		this.kms = kms;
	}

	public Double getCaloris(){
		return caloris;
	}
	public void setCaloris(Double caloris){
		this.caloris = caloris;
	}



}

