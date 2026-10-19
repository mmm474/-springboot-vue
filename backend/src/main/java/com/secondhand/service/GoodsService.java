package com.secondhand.service;

import com.secondhand.common.Result;
import com.secondhand.entity.*;
import com.secondhand.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoodsService {

    private final GoodsRepository goodsRepository;
    private final UserRepository userRepository;
    private final RemarkRepository remarkRepository;
    private final LikesRepository likesRepository;
    private final StepRepository stepRepository;
    private final UserService userService;

    /**
     * 发布商品
     */
    public Result<?> addGoods(Integer userId, String title, Integer price, String descr,
                              String categorie, String images) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return Result.fail(201, "用户不存在");
        }
        Goods goods = new Goods();
        goods.setTitle(title);
        goods.setPrice(price);
        goods.setDescr(descr);
        goods.setCategorie(categorie);
        goods.setImages(images);
        goods.setUser(user);
        goods.setLikes(0);
        goods.setCreatedAt(new Date());
        goodsRepository.save(goods);
        return Result.success("添加成功");
    }

    /**
     * 删除商品
     */
    @Transactional
    public Result<?> delGoods(Integer goodsId) {
        Goods goods = goodsRepository.findById(goodsId).orElse(null);
        if (goods == null) {
            return Result.fail(201, "商品不存在");
        }
        goodsRepository.delete(goods);
        return Result.success("删除成功");
    }

    /**
     * 商品列表（分页）
     */
    public Result<?> getGoodsList(Integer page, Integer pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<Goods> goodsPage = goodsRepository.findAllOrderByIdDesc(pageable);
        List<Goods> list = goodsPage.getContent();
        sanitizeUsers(list);
        return Result.success("获取成功", list);
    }

    /**
     * 按分类获取商品列表
     */
    public Result<?> getListByCategorie(Integer page, Integer pageSize, String categorie) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<Goods> goodsPage;
        if (categorie == null || categorie.isEmpty()) {
            goodsPage = goodsRepository.findAllOrderByIdDesc(pageable);
        } else {
            goodsPage = goodsRepository.findByCategorieOrderByIdDesc(categorie, pageable);
        }
        List<Goods> list = goodsPage.getContent();
        sanitizeUsers(list);
        return Result.success("获取成功", list);
    }

    /**
     * 搜索商品
     */
    public Result<?> searchGoods(Integer page, Integer pageSize, String keyword) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<Goods> goodsPage = goodsRepository.searchByTitle(keyword, pageable);
        List<Goods> list = goodsPage.getContent();
        sanitizeUsers(list);
        return Result.success("获取成功", list);
    }

    /**
     * 商品详情
     */
    public Result<?> getGoodsDetail(Integer goodsId) {
        Goods goods = goodsRepository.findById(goodsId).orElse(null);
        if (goods == null) {
            return Result.fail(201, "商品不存在");
        }
        sanitizeUser(goods);
        return Result.success("获取成功", goods);
    }

    /**
     * 用户发布的商品
     */
    public Result<?> getUserGoodsList(Integer userId) {
        List<Goods> list = goodsRepository.findByUserId(userId);
        return Result.success("获取成功", list);
    }

    /**
     * 评论商品
     */
    public Result<?> addRemark(Integer userId, Integer goodsId, String content) {
        User user = userRepository.findById(userId).orElse(null);
        Goods goods = goodsRepository.findById(goodsId).orElse(null);
        if (user == null || goods == null) {
            return Result.fail(201, "用户或商品不存在");
        }
        Remark remark = new Remark();
        remark.setContent(content);
        remark.setNickname(user.getNickname());
        remark.setAvatar(user.getAvatar());
        remark.setUser(user);
        remark.setGoods(goods);
        remark.setCreatedAt(new Date());
        remarkRepository.save(remark);
        return Result.success("评论成功");
    }

    /**
     * 点赞商品
     */
    @Transactional
    public Result<?> addLike(Integer userId, Integer goodsId) {
        User user = userRepository.findById(userId).orElse(null);
        Goods goods = goodsRepository.findById(goodsId).orElse(null);
        if (user == null || goods == null) {
            return Result.fail(201, "用户或商品不存在");
        }
        goods.setLikes(goods.getLikes() + 1);
        goodsRepository.save(goods);

        Likes like = new Likes();
        like.setUser(user);
        like.setGoods(goods);
        like.setCreatedAt(new Date());
        likesRepository.save(like);
        return Result.success("点赞成功");
    }

    /**
     * 取消点赞
     */
    @Transactional
    public Result<?> delLike(Integer userId, Integer goodsId) {
        User user = userRepository.findById(userId).orElse(null);
        Goods goods = goodsRepository.findById(goodsId).orElse(null);
        if (user == null || goods == null) {
            return Result.fail(201, "用户或商品不存在");
        }
        goods.setLikes(goods.getLikes() - 1);
        goodsRepository.save(goods);

        likesRepository.deleteByUserAndGoods(user, goods);
        return Result.success("取消点赞成功");
    }

    /**
     * 获取用户点赞列表
     */
    public Result<?> getLikeList(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return Result.fail(201, "用户不存在");
        }
        List<Likes> likes = likesRepository.findByUser(user);
        return Result.success("获取点赞列表成功", likes);
    }

    /**
     * 添加浏览历史
     */
    @Transactional
    public Result<?> addHistory(Integer userId, Integer goodsId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return Result.fail(201, "用户不存在");
        }
        Step exist = stepRepository.findByUserAndGoodid(user, goodsId);
        if (exist != null) {
            exist.setCreatedAt(new Date());
            stepRepository.save(exist);
            return Result.success("添加历史成功");
        }
        Goods goods = goodsRepository.findById(goodsId).orElse(null);
        if (goods == null) {
            return Result.fail(201, "商品不存在");
        }
        if (goods.getUser() != null && userId.equals(goods.getUser().getId())) {
            return Result.fail(201, "");
        }
        Step step = new Step();
        step.setUser(user);
        step.setGoodid(goods.getId());
        step.setTitle(goods.getTitle());
        step.setPublicer(goods.getUser() != null ? goods.getUser().getNickname() : "");
        step.setPublicerId(goods.getUser() != null ? goods.getUser().getId() : 0);
        String cover = goods.getImages();
        if (cover != null && cover.contains(",")) {
            cover = cover.split(",")[0];
        }
        step.setCover(cover);
        step.setCreatedAt(new Date());
        stepRepository.save(step);
        return Result.success("添加历史成功");
    }

    /**
     * 获取浏览历史
     */
    public Result<?> getHistory(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return Result.fail(201, "用户不存在");
        }
        List<Step> steps = stepRepository.findByUser(user);
        return Result.success("获取历史成功", steps);
    }

    /**
     * 清除 user 中的敏感字段
     */
    private void sanitizeUsers(List<Goods> goodsList) {
        for (Goods g : goodsList) {
            sanitizeUser(g);
        }
    }

    private void sanitizeUser(Goods goods) {
        if (goods.getUser() != null) {
            goods.getUser().setPassword(null);
            goods.getUser().setUsername(null);
        }
    }
}
