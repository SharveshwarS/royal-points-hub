package com.vigor.points.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.vigor.points.entity.User;
import com.vigor.points.service.UserService;
import com.vigor.points.entity.PointsTransaction;
import com.vigor.points.service.PointsService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserService userService;
    private final PointsService pointsService;

    public AdminController(UserService userService,PointsService pointsService) {
        this.userService = userService;
        this.pointsService = pointsService;
    }

        @PostMapping("/add-points")
    public PointsTransaction addPoints(
            @RequestParam Long userId,
            @RequestParam int points,
            @RequestParam String reason) {

        return pointsService.addPoints(userId, points, reason);
    }

    @PostMapping("/deduct-points")
    public PointsTransaction deductPoints(
            @RequestParam Long userId,
            @RequestParam int points,
            @RequestParam String reason) {

        return pointsService.deductPoints(userId, points, reason);
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
}