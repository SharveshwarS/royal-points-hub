package com.vigor.points.service;
import java.util.List;
import org.springframework.stereotype.Service;

import com.vigor.points.entity.User;
import com.vigor.points.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long userId) {

    return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
}

    public User loginUser(String email, String password) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!user.getPassword().equals(password)) {
        throw new RuntimeException("Invalid password");
    }

    return user;

    
}
}