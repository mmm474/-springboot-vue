package com.secondhand.repository;

import com.secondhand.entity.Goods;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoodsRepository extends JpaRepository<Goods, Integer> {

    @Query("select g from Goods g order by g.id desc")
    Page<Goods> findAllOrderByIdDesc(Pageable pageable);

    @Query("select g from Goods g where g.categorie = :categorie order by g.id desc")
    Page<Goods> findByCategorieOrderByIdDesc(@Param("categorie") String categorie, Pageable pageable);

    @Query("select g from Goods g where g.title like concat('%', :keyword, '%') order by g.id desc")
    Page<Goods> searchByTitle(@Param("keyword") String keyword, Pageable pageable);

    List<Goods> findByUserId(Integer userId);
}
