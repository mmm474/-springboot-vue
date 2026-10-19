package com.secondhand.vo;

import lombok.Data;

import java.util.Date;

/**
 * 用户信息 VO（去除敏感字段）
 */
@Data
public class UserVo {
    private Integer id;
    private String userCode;
    private Integer role;
    private String nickname;
    private String avatar;
    private String phone;
    private Date createdAt;
    private Integer sex;
    private String describes;
}
