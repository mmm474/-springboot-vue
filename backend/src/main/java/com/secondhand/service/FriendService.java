package com.secondhand.service;

import com.secondhand.common.Result;
import com.secondhand.entity.Friend;
import com.secondhand.entity.User;
import com.secondhand.repository.FriendRepository;
import com.secondhand.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendService {

    private final FriendRepository friendRepository;
    private final UserRepository userRepository;

    /**
     * 添加好友
     */
    @Transactional
    public Result<?> addFriend(Integer userId, Integer friendId) {
        if (userId.equals(friendId)) {
            return Result.fail(201, "不能添加自己为好友");
        }
        User user = userRepository.findById(userId).orElse(null);
        User friend = userRepository.findById(friendId).orElse(null);
        if (user == null) {
            return Result.fail(201, "用户不存在");
        }
        if (friend == null) {
            return Result.fail(201, "好友不存在");
        }
        boolean exists = friendRepository.existsByUserIdAndFriendId(userId, friendId);
        if (exists) {
            return Result.fail(201, "已经是好友了");
        }
        Friend newFriend = new Friend();
        newFriend.setUser(user);
        newFriend.setFriendId(friendId);
        newFriend.setAvatar(friend.getAvatar());
        newFriend.setNickname(friend.getNickname());
        newFriend.setPhone(friend.getPhone());
        newFriend.setDescribes(friend.getDescribes());
        newFriend.setSex(friend.getSex());
        newFriend.setCreatedAt(new Date());
        friendRepository.save(newFriend);
        return Result.success("Add friend successfully");
    }

    /**
     * 获取好友列表
     */
    public Result<?> getFriendList(Integer userId) {
        List<Friend> friends = friendRepository.findByUserId(userId);
        return Result.success("Get friend list successfully", friends);
    }

    /**
     * 删除好友
     */
    @Transactional
    public Result<?> deleteFriend(Integer friendId) {
        friendRepository.deleteByFriendId(friendId);
        return Result.success("Delete friend successfully");
    }
}
