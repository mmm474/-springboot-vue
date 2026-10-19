package com.secondhand.controller;

import com.secondhand.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tools")
@RequiredArgsConstructor
public class ToolsController {

    /**
     * 单文件上传（字段名: file）
     */
    @PostMapping("/upload")
    public Result<?> upload(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        if (file == null || file.isEmpty()) {
            return Result.fail(400, "未接收到文件，请确认字段名为 file");
        }
        String url = UploadHelper.saveAndGetUrl(file, request);
        Map<String, Object> data = new HashMap<>();
        data.put("url", url);
        return Result.success("上传成功", data);
    }

    /**
     * 多文件上传（字段名: files，最多 9 张）
     */
    @PostMapping("/uploadMulti")
    public Result<?> uploadMulti(@RequestParam("files") MultipartFile[] files, HttpServletRequest request) {
        if (files == null || files.length == 0) {
            return Result.fail(400, "未接收到文件，请确认字段名为 files");
        }
        if (files.length > 9) {
            return Result.fail(400, "一次最多上传 9 张图片");
        }
        List<String> urls = new ArrayList<>();
        for (MultipartFile f : files) {
            if (!f.isEmpty()) {
                urls.add(UploadHelper.saveAndGetUrl(f, request));
            }
        }
        Map<String, Object> data = new HashMap<>();
        data.put("urls", urls);
        data.put("count", urls.size());
        return Result.success("上传成功 " + urls.size() + " 张", data);
    }
}
