package com.secondhand.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "step")
public class Step {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private Integer goodid;

    @Column(length = 255)
    private String title;

    @Column(columnDefinition = "varchar(255) default ''")
    private String publicer;

    @Column(name = "publicer_id", columnDefinition = "int default 0")
    private Integer publicerId;

    @Column(columnDefinition = "longtext")
    private String cover;

    /** 日期 */
    @Column(name = "created_at", columnDefinition = "timestamp default CURRENT_TIMESTAMP")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
