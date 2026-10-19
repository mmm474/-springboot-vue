package com.secondhand.interceptor;

import com.secondhand.common.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.HashMap;
import java.util.Map;

/**
 * JWT 认证拦截器
 * 从请求头 token 字段取出 token 并校验
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 放行 OPTIONS 预检
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String token = request.getHeader("token");
        if (token == null || token.isEmpty()) {
            sendError(response, 401, "请先登录", null);
            return false;
        }

        Claims claims = jwtUtil.parseToken(token);
        if (claims == null) {
            sendError(response, 401, "token已过期，请重新登录", 433);
            return false;
        }

        // 将用户信息放入 request，供 controller 使用
        request.setAttribute("userId", claims.get("id"));
        request.setAttribute("claims", claims);
        return true;
    }

    private void sendError(HttpServletResponse response, int status, String message, Integer code) throws Exception {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        Map<String, Object> body = new HashMap<>();
        body.put("message", message);
        if (code != null) {
            body.put("code", code);
        }
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
