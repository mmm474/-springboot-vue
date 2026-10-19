package com.secondhand.repository;

import com.secondhand.entity.Step;
import com.secondhand.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StepRepository extends JpaRepository<Step, Integer> {

    List<Step> findByUser(User user);

    Step findByUserAndGoodid(User user, Integer goodid);
}
