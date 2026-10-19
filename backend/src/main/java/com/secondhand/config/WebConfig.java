package com.secondhand.config;

import com.secondhand.interceptor.AuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

/**
 * Web 配置：CORS、静态资源、拦截器
 */
@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;

    @Value("${app.upload.path}")
    private String uploadPath;

    /**
     * 跨域配置
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    /**
     * 静态资源映射：把上传目录映射到 /static/**
     * 与原 Node 端 /static 前缀保持一致
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 项目内上传目录
        String location = "file:" + System.getProperty("user.dir") + "/" + uploadPath + "/";
        registry.addResourceHandler("/static/**")
                .addResourceLocations(location);
    }

    /**
     * 注册 JWT 拦截器
     * 放行：登录、注册、验证码、静态资源
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(
                        "/user/register",
                        "/user/login",
                        "/user/create",
                        "/user/getcode",
                        "/user/checkcode",
                        "/static/**",
                        "/error"
                );
    }
}
