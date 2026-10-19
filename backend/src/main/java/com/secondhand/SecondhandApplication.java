package com.secondhand;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SecondhandApplication {

    public static void main(String[] args) {
        SpringApplication.run(SecondhandApplication.class, args);
        System.out.println("========================================");
        System.out.println("  二手交易平台后端启动成功 (Spring Boot) ");
        System.out.println("  接口前缀: http://localhost:8080/api   ");
        System.out.println("========================================");
    }
}
