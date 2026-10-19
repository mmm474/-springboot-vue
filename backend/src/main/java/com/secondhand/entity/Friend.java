package com.secondhand.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "friend")
public class Friend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /** 好友用户 id */
    @Column(name = "friend_id", columnDefinition = "int default 0")
    private Integer friendId;

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

    /** 性别 */
    @Column(columnDefinition = "int default 0")
    private Integer sex;

    /** 简介 */
    @Column(length = 255, columnDefinition = "varchar(255) default ''")
    private String describes;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
