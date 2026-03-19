package com.vigor.points.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.vigor.points.entity.User;
import com.vigor.points.service.UserService;
import com.vigor.points.entity.PointsTransaction;
import com.vigor.points.service.PointsService;
import com.vigor.points.dto.PointsRequest;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserService userService;
    private final PointsService pointsService;

    public AdminController(UserService userService, PointsService pointsService) {
        this.userService = userService;
        this.pointsService = pointsService;
    }

    @PostMapping("/add-points")
    public PointsTransaction addPoints(@RequestBody PointsRequest request) {

        return pointsService.addPoints(
                request.getUserId(),
                request.getPoints(),
                request.getReason());
    }

    @PostMapping("/deduct-points")
    public PointsTransaction deductPoints(@RequestBody PointsRequest request) {

        return pointsService.deductPoints(
                request.getUserId(),
                request.getPoints(),
                request.getReason());
    }

    @GetMapping("/transactions")
    public List<PointsTransaction> getAllTransactions() {
        return pointsService.getAllTransactions();
    }

    @GetMapping("/user/{userId}")
    public List<PointsTransaction> getUserTransactions(@PathVariable Long userId) {
        return pointsService.getUserPoints(userId);
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/total-points/{userId}")
    public int getTotalPoints(@PathVariable Long userId) {
    User user = userService.getUserById(userId);
    return user.getPoints();
}

@DeleteMapping("/userTra/{userId}")
    public String deleteTransactions(@PathVariable Long userId) {

        pointsService.deleteTransactionsByUserId(userId);

        return "All transactions deleted for userId: " + userId;
    }
}