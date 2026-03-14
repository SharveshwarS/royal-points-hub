package com.vigor.points.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vigor.points.entity.PointsTransaction;
import com.vigor.points.repository.PointsTransactionRepository;

@Service
public class PointsService {

    private final PointsTransactionRepository repo;

    public PointsService(PointsTransactionRepository repo) {
        this.repo = repo;
    }

    // ADD POINTS
    public PointsTransaction addPoints(Long userId, int points, String reason) {

        PointsTransaction transaction = new PointsTransaction();
        transaction.setUserId(userId);
        transaction.setPoints(points);
        transaction.setType("ADD");
        transaction.setReason(reason);

        return repo.save(transaction);
    }

    // REMOVE POINTS
    public PointsTransaction deductPoints(Long userId, int points, String reason) {

        PointsTransaction transaction = new PointsTransaction();
        transaction.setUserId(userId);
        transaction.setPoints(points);
        transaction.setType("DEDUCT");
        transaction.setReason(reason);

        return repo.save(transaction);
    }

    // GET USER HISTORY
    public List<PointsTransaction> getUserPoints(Long userId) {
        return repo.findByUserId(userId);
    }

    // GET ALL TRANSACTIONS
    public List<PointsTransaction> getAllTransactions() {
        return repo.findAll();
    }
}