package com.vigor.points.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vigor.points.entity.User;
import com.vigor.points.entity.PointsTransaction;
import com.vigor.points.repository.UserRepository;
import com.vigor.points.repository.PointsTransactionRepository;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PointsService {

    private final PointsTransactionRepository repo;
    private final UserRepository userRepository;

    public PointsService(PointsTransactionRepository repo,UserRepository userRepository) {
        this.repo = repo;
        this.userRepository = userRepository;
    }


    // ADD POINTS
    public PointsTransaction addPoints(Long userId, int points, String reason) {

         User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPoints(user.getPoints() + points);
        userRepository.save(user);

        PointsTransaction transaction = new PointsTransaction();
        transaction.setUserId(userId);
        //transaction.setUser(user);
        transaction.setPoints(points);
        transaction.setType("ADD");
        transaction.setReason(reason);

        return repo.save(transaction);
    }

    // REMOVE POINTS
    public PointsTransaction deductPoints(Long userId, int points, String reason) {

           User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

            user.setPoints(user.getPoints() - points);
            userRepository.save(user);

        PointsTransaction transaction = new PointsTransaction();
       transaction.setUserId(userId);
       //transaction.setUser(user);
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
    // public List<PointsTransaction> getAllTransactions() {
    //     return repo.findAll();
    // }
    public List<PointsTransaction> getAllTransactions() {
    return repo.findAll(Sort.by(Sort.Direction.DESC, "id"));
}
@Transactional
public void deleteTransactionsByUserId(Long userId) {
    repo.deleteTransactionsByUserId(userId); // or deleteByUserId(userId)
}
 
}

