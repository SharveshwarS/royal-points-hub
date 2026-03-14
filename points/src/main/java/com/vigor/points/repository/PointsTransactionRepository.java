package com.vigor.points.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vigor.points.entity.PointsTransaction;

public interface PointsTransactionRepository extends JpaRepository<PointsTransaction, Long> {

    List<PointsTransaction> findByUserId(Long userId);
}