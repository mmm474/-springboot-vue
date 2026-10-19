package com.secondhand.controller;

import com.secondhand.service.GoodsService;
import com.secondhand.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/goods")
@RequiredArgsConstructor
public class GoodsController {

    private final GoodsService goodsService;

    /**
     * 发布商品
     */
    @PostMapping("/publish")
    public Result<?> publish(HttpServletRequest request, @RequestBody Map<String, Object> body) {
        Integer userId = getUserId(request);
        String title = (String) body.get("title");
        Integer price = toInt(body.get("price"));
        String descr = (String) body.get("descr");
        String categorie = (String) body.get("categorie");
        String images = (String) body.get("images");
        return goodsService.addGoods(userId, title, price, descr, categorie, images);
    }

    /**
     * 删除商品
     */
    @PostMapping("/delete")
    public Result<?> delete(@RequestBody Map<String, Object> body) {
        Integer id = toInt(body.get("id"));
        return goodsService.delGoods(id);
    }

    /**
     * 商品列表
     */
    @GetMapping("/list")
    public Result<?> list(@RequestParam(defaultValue = "1") Integer page,
                          @RequestParam(defaultValue = "10") Integer pageSize) {
        return goodsService.getGoodsList(page, pageSize);
    }

    /**
     * 按分类获取商品列表
     */
    @GetMapping("/getListByCategorie")
    public Result<?> getListByCategorie(@RequestParam(defaultValue = "1") Integer page,
                                        @RequestParam(defaultValue = "10") Integer pageSize,
                                        @RequestParam(required = false) String categorie) {
        return goodsService.getListByCategorie(page, pageSize, categorie);
    }

    /**
     * 商品详情
     */
    @GetMapping("/detail")
    public Result<?> detail(@RequestParam Integer id) {
        return goodsService.getGoodsDetail(id);
    }

    /**
     * 用户发布的商品
     */
    @GetMapping("/userlist")
    public Result<?> userList(@RequestParam(required = false) Integer id, HttpServletRequest request) {
        Integer userId = (id != null) ? id : getUserId(request);
        return goodsService.getUserGoodsList(userId);
    }

    /**
     * 评论商品
     */
    @PostMapping("/upremark")
    public Result<?> upRemark(HttpServletRequest request, @RequestBody Map<String, Object> body) {
        Integer userId = getUserId(request);
        Integer id = toInt(body.get("id"));
        String content = (String) body.get("content");
        return goodsService.addRemark(userId, id, content);
    }

    /**
     * 点赞
     */
    @PostMapping("/uplike")
    public Result<?> upLike(HttpServletRequest request, @RequestBody Map<String, Object> body) {
        Integer userId = getUserId(request);
        Integer id = toInt(body.get("id"));
        return goodsService.addLike(userId, id);
    }

    /**
     * 取消点赞
     */
    @PostMapping("/downlike")
    public Result<?> downLike(HttpServletRequest request, @RequestBody Map<String, Object> body) {
        Integer userId = getUserId(request);
        Integer id = toInt(body.get("id"));
        return goodsService.delLike(userId, id);
    }

    /**
     * 用户点赞列表
     */
    @GetMapping("/getlikes")
    public Result<?> getLikes(HttpServletRequest request) {
        Integer userId = getUserId(request);
        return goodsService.getLikeList(userId);
    }

    /**
     * 添加浏览历史
     */
    @PostMapping("/addhistory")
    public Result<?> addHistory(HttpServletRequest request, @RequestBody Map<String, Object> body) {
        Integer userId = getUserId(request);
        Integer id = toInt(body.get("id"));
        return goodsService.addHistory(userId, id);
    }

    /**
     * 获取浏览历史
     */
    @GetMapping("/gethistory")
    public Result<?> getHistory(HttpServletRequest request) {
        Integer userId = getUserId(request);
        return goodsService.getHistory(userId);
    }

    /**
     * 搜索商品
     */
    @PostMapping("/search")
    public Result<?> search(@RequestBody Map<String, Object> body) {
        Integer page = toInt(body.getOrDefault("page", 1));
        Integer pageSize = toInt(body.getOrDefault("pageSize", 999));
        String title = (String) body.get("title");
        return goodsService.searchGoods(page, pageSize, title);
    }

    private Integer getUserId(HttpServletRequest request) {
        Object obj = request.getAttribute("userId");
        return Integer.valueOf(obj.toString());
    }

    private Integer toInt(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Number) return ((Number) obj).intValue();
        return Integer.valueOf(obj.toString());
    }
}
