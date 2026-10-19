package com.secondhand.common;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT 工具类
 * token 放在请求头 token 字段中
 */
@Slf4j
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expire}")
    private Long expire;

    private SecretKey key;

    @PostConstruct
    public void init() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        // jjwt 0.12 需要至少 32 字节的密钥
        byte[] padded = new byte[32];
        System.arraycopy(keyBytes, 0, padded, 0, Math.min(keyBytes.length, 32));
        this.key = Keys.hmacShaKeyFor(padded);
    }

    /**
     * 生成 token
     */
    public String generateToken(Map<String, Object> claims) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expire);
        return Jwts.builder()
                .claims(claims)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    /**
     * 生成 token（便捷方法）
     */
    public String generateToken(Integer userId, String nickname, String avatar, String phone,
                                Integer sex, String describes, Integer role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", userId);
        claims.put("nickname", nickname);
        claims.put("avatar", avatar);
        claims.put("phone", phone);
        claims.put("sex", sex);
        claims.put("describes", describes);
        claims.put("role", role);
        // 与原 Node 端一致，username / password 不放入 token
        return generateToken(claims);
    }

    /**
     * 解析 token
     */
    public Claims parseToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            log.warn("JWT 解析失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 校验 token 是否有效
     */
    public boolean validateToken(String token) {
        return parseToken(token) != null;
    }

    /**
     * 从 token 获取用户 id
     */
    public Integer getUserId(String token) {
        Claims claims = parseToken(token);
        if (claims == null) return null;
        Object id = claims.get("id");
        if (id == null) return null;
        return Integer.valueOf(id.toString());
    }
}
