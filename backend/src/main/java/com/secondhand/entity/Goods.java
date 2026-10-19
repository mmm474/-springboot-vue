package com.secondhand.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "goods")
public class Goods {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 255)
    private String title;

    @Column
    private Integer price;

    @Column(columnDefinition = "longtext")
    private String descr;

    @Column(columnDefinition = "longtext")
    private String images;

    /** 分类 */
    @Column(length = 255)
    private String categorie;

    /** 点赞数 */
    @Column(columnDefinition = "int default 0")
    private Integer likes;

    /** 日期 */
    @Column(name = "created_at", columnDefinition = "timestamp default CURRENT_TIMESTAMP")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "goods", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Remark> remarks;

    @JsonIgnore
    @OneToMany(mappedBy = "goods", cascade = CascadeType.ALL)
    private List<Likes> likeList;
}
