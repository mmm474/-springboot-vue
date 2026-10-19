package com.secondhand.controller;

import com.secondhand.common.CaptchaUtil;
import com.secondhand.common.Result;
import com.secondhand.service.UserService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 注册
     */
    @PostMapping("/register")
    public Result<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        return userService.userRegister(username, password);
    }

    /**
     * 登录
     */
    @PostMapping("/login")
    public Result<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String userCode = body.get("user_code");
        return userService.userLogin(username, password, userCode);
    }

    /**
     * 获取当前用户信息（从 token 解析）
     */
    @GetMapping("/info")
    public Result<?> info(HttpServletRequest request) {
        Claims claims = (Claims) request.getAttribute("claims");
        return userService.infoFromClaims(claims);
    }

    /**
     * 查询用户信息
     */
    @GetMapping("/search")
    public Result<?> search(HttpServletRequest request) {
        Object userIdObj = request.getAttribute("userId");
        Integer userId = Integer.valueOf(userIdObj.toString());
        return userService.searchUser(userId);
    }

    /**
     * 修改用户信息（带文件上传）
     */
    @PostMapping("/updateInfo")
    public Result<?> updateInfo(HttpServletRequest request,
                                @RequestParam(value = "nickname", required = false) String nickname,
                                @RequestParam(value = "phone", required = false) String phone,
                                @RequestParam(value = "sex", required = false) Integer sex,
                                @RequestParam(value = "describes", required = false) String describes,
                                @RequestParam(value = "files", required = false) MultipartFile[] files) {
        Object userIdObj = request.getAttribute("userId");
        Integer userId = Integer.valueOf(userIdObj.toString());

        String avatar = "";
        if (files != null && files.length > 0 && !files[0].isEmpty()) {
            avatar = UploadHelper.saveAndGetUrl(files[0], request);
        }
        return userService.updateUserInfo(userId, nickname, avatar, phone, sex, describes);
    }

    /**
     * 修改密码
     */
    @PostMapping("/updatePassword")
    public Result<?> updatePassword(HttpServletRequest request, @RequestBody Map<String, String> body) {
        Object userIdObj = request.getAttribute("userId");
        Integer userId = Integer.valueOf(userIdObj.toString());
        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");
        return userService.updatePassword(userId, oldPassword, newPassword);
    }

    /**
     * 生成验证码（返回 SVG）
     */
    @GetMapping(value = "/create", produces = "image/svg+xml")
    public String createCaptcha(HttpSession session) {
        String text = CaptchaUtil.generateText();
        session.setAttribute("codeText", text);
        return CaptchaUtil.generateSvg(text);
    }

    /**
     * 获取验证码 URL
     */
    @GetMapping("/getcode")
    public Result<?> getCode() {
        String url = "http://127.0.0.1:8080/api/user/create";
        Map<String, Object> data = new HashMap<>();
        data.put("url", url);
        return Result.success("获取验证码成功", url);
    }

    /**
     * 校验验证码（不区分大小写）
     */
    @PostMapping("/checkcode")
    public Result<?> checkCode(@RequestBody Map<String, String> body, HttpSession session) {
        String code = body.get("code");
        Object saved = session.getAttribute("codeText");
        if (saved != null && saved.toString().equalsIgnoreCase(code)) {
            return Result.success("验证码正确");
        }
        return Result.fail(400, "验证码错误");
    }
}
