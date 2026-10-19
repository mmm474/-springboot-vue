package com.secondhand.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * 文件上传辅助工具
 * 与原 Node 端 uploads.ts / toPublicUrl 行为对齐：
 *   - 存储到 src/static/image/ 目录
 *   - 文件名: 时间戳_原文件名
 *   - 返回 http://host:port/static/image/xxx
 */
public class UploadHelper {

    private static final String UPLOAD_DIR = "src/static/image";

    /**
     * 保存文件并返回对外可访问 URL
     */
    public static String saveAndGetUrl(MultipartFile file, HttpServletRequest request) {
        if (file == null || file.isEmpty()) {
            return "";
        }
        try {
            Path dirPath = Paths.get(System.getProperty("user.dir"), UPLOAD_DIR);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }
            String original = file.getOriginalFilename();
            String fileName = System.currentTimeMillis() + "_" + (original != null ? original : "file");
            Path target = dirPath.resolve(fileName);
            file.transferTo(target.toFile());

            String scheme = request.getScheme();
            String serverName = request.getServerName();
            int serverPort = request.getServerPort();
            return scheme + "://" + serverName + ":" + serverPort + "/static/image/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("文件保存失败: " + e.getMessage(), e);
        }
    }
}
