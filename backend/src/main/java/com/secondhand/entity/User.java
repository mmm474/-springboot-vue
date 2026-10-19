package com.secondhand.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 255, columnDefinition = "varchar(255) default '用户'")
    private String username;

    @Column(name = "user_code", length = 255, columnDefinition = "varchar(255) default ''")
    private String userCode;

    @Column(length = 255, columnDefinition = "varchar(255) default '123456'")
    private String password;

    /** 管理员和普通用户 0-普通 1-管理员 */
    @Column(columnDefinition = "int default 0")
    private Integer role;

    /** 昵称 */
    @Column(length = 255, columnDefinition = "varchar(255) default '用户'")
    private String nickname;

    /** 头像 */
    @Column(length = 255, columnDefinition = "varchar(255) default ''")
    private String avatar;

    /** 电话 */
    @Column(length = 255, columnDefinition = "varchar(255) default ''")
    private String phone;

    /** 日期 */
    @Column(name = "created_at", columnDefinition = "timestamp default CURRENT_TIMESTAMP")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    /** 性别 0-未知 1-男 2-女 */
    @Column(columnDefinition = "int default 0")
    private Integer sex;

    /** 简介 */
    @Column(length = 255, columnDefinition = "varchar(255) default ''")
    private String describes;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Goods> goods;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Remark> remarks;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Likes> likes;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Friend> friends;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Step> steps;
}
