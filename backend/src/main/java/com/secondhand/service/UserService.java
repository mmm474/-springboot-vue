package com.secondhand.service;

import com.secondhand.common.JwtUtil;
import com.secondhand.common.Result;
import com.secondhand.entity.User;
import com.secondhand.repository.UserRepository;
import com.secondhand.vo.UserVo;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    /**
     * 用户注册
     */
    public Result<?> userRegister(String username, String password) {
        User exist = userRepository.findByUsername(username);
        if (exist != null) {
            return Result.fail(201, "用户名已存在");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setNickname("用户" + new Random().nextInt(1000));
        user.setCreatedAt(new Date());
        userRepository.save(user);
        return Result.success("注册成功");
    }

    /**
     * 用户登录
     */
    public Result<?> userLogin(String username, String password, String userCode) {
        User user = userRepository.findByUsernameAndPassword(username, password);
        if (user == null) {
            return Result.fail(201, "用户名或密码错误");
        }
        // 与原逻辑一致：传入 user_code 时更新
        if (userCode != null) {
            user.setUserCode(userCode);
            userRepository.save(user);
        }
        String token = jwtUtil.generateToken(
                user.getId(),
                user.getNickname(),
                user.getAvatar(),
                user.getPhone(),
                user.getSex(),
                user.getDescribes(),
                user.getRole()
        );
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        return Result.success("登录成功", data);
    }

    /**
     * 查询用户信息（带商品）
     */
    public Result<?> searchUser(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return Result.fail(201, "用户不存在");
        }
        UserVo vo = toVo(user);
        return Result.success("查询成功", vo);
    }

    /**
     * 从 token 解析出的 claims 构建用户信息
     */
    public Result<?> infoFromClaims(Claims claims) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", claims.get("id"));
        data.put("nickname", claims.get("nickname"));
        data.put("avatar", claims.get("avatar"));
        data.put("phone", claims.get("phone"));
        data.put("sex", claims.get("sex"));
        data.put("describes", claims.get("describes"));
        data.put("role", claims.get("role"));
        return Result.success("获取信息成功", data);
    }

    /**
     * 更新用户信息
     */
    public Result<?> updateUserInfo(Integer userId, String nickname, String avatar,
                                    String phone, Integer sex, String describes) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return Result.fail(201, "用户不存在");
        }
        if (nickname != null) user.setNickname(nickname);
        if (avatar != null && !avatar.isEmpty()) user.setAvatar(avatar);
        if (phone != null) user.setPhone(phone);
        if (sex != null) user.setSex(sex);
        if (describes != null) user.setDescribes(describes);
        userRepository.save(user);

        // 重新签发 token
        String token = jwtUtil.generateToken(
                user.getId(),
                user.getNickname(),
                user.getAvatar(),
                user.getPhone(),
                user.getSex(),
                user.getDescribes(),
                user.getRole()
        );
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("userInfo", toVo(user));
        return Result.success("更新成功", data);
    }

    /**
     * 修改密码
     */
    public Result<?> updatePassword(Integer userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return Result.fail(201, "用户不存在");
        }
        if (!user.getPassword().equals(oldPassword)) {
            return Result.fail(201, "旧密码错误");
        }
        user.setPassword(newPassword);
        userRepository.save(user);
        return Result.success("修改成功");
    }

    /**
     * 转换为安全 VO（去除 password / username）
     */
    public UserVo toVo(User user) {
        UserVo vo = new UserVo();
        vo.setId(user.getId());
        vo.setUserCode(user.getUserCode());
        vo.setRole(user.getRole());
        vo.setNickname(user.getNickname());
        vo.setAvatar(user.getAvatar());
        vo.setPhone(user.getPhone());
        vo.setCreatedAt(user.getCreatedAt());
        vo.setSex(user.getSex());
        vo.setDescribes(user.getDescribes());
        return vo;
    }

    public User getById(Integer userId) {
        return userRepository.findById(userId).orElse(null);
    }
}
