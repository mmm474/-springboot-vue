package com.secondhand.repository;

import com.secondhand.entity.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Integer> {

    List<Friend> findByUserId(Integer userId);

    void deleteByFriendId(Integer friendId);

    boolean existsByUserIdAndFriendId(Integer userId, Integer friendId);
}
