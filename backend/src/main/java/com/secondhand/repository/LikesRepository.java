package com.secondhand.repository;

import com.secondhand.entity.Likes;
import com.secondhand.entity.User;
import com.secondhand.entity.Goods;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikesRepository extends JpaRepository<Likes, Integer> {

    List<Likes> findByUser(User user);

    void deleteByUserAndGoods(User user, Goods goods);

    boolean existsByUserAndGoods(User user, Goods goods);
}
