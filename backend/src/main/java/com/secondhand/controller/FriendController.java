package com.secondhand.controller;

import com.secondhand.common.Result;
import com.secondhand.service.FriendService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/friend")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;

    /**
     * 添加好友
     */
    @PostMapping("/add")
    public Result<?> add(HttpServletRequest request, @RequestBody Map<String, Object> body) {
        Object userIdObj = request.getAttribute("userId");
        Integer userId = Integer.valueOf(userIdObj.toString());
        Integer friendId = Integer.valueOf(body.get("friendId").toString());
        return friendService.addFriend(userId, friendId);
    }

    /**
     * 好友列表
     */
    @GetMapping("/list")
    public Result<?> list(HttpServletRequest request) {
        Object userIdObj = request.getAttribute("userId");
        Integer userId = Integer.valueOf(userIdObj.toString());
        return friendService.getFriendList(userId);
    }

    /**
     * 删除好友
     */
    @PostMapping("/delete")
    public Result<?> delete(@RequestBody Map<String, Object> body) {
        Integer friendId = Integer.valueOf(body.get("friendId").toString());
        return friendService.deleteFriend(friendId);
    }
}
