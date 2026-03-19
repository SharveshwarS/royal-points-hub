package com.vigor.points.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.vigor.points.dto.LoginRequest;
import com.vigor.points.entity.User;
import com.vigor.points.service.UserService;
import com.vigor.points.service.PointsService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final PointsService pointsService;

    public AuthController(UserService userService, PointsService pointsService) {
        this.userService = userService;
        this.pointsService = pointsService;
    }

    @PostMapping("/signup")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
public User login(@RequestBody LoginRequest loginRequest) {

    return userService.loginUser(
            loginRequest.getEmail(),
            loginRequest.getPassword()
    );
}

@PutMapping("/update_users/{id}")
public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
    return userService.updateUser(id, updatedUser);
}

@DeleteMapping("/delete_users/{id}")
public void deleteUser(@PathVariable Long id) {
    userService.deleteUser(id);
}

}