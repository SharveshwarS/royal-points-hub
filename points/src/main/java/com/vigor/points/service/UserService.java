package com.vigor.points.service;
import java.util.List;

import org.springframework.stereotype.Service;

import com.vigor.points.entity.User;
import com.vigor.points.repository.PointsTransactionRepository;
 import com.vigor.points.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PointsTransactionRepository PointsTransactionRepository;
   


    public UserService(UserRepository userRepository,PointsTransactionRepository PointsTransactionRepository) {
        this.userRepository = userRepository;
        this.PointsTransactionRepository = PointsTransactionRepository;

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

public User updateUser(Long id, User updatedUser) {

    User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // update only if provided
    if (updatedUser.getName() != null) {
        user.setName(updatedUser.getName());
    }

    if (updatedUser.getEmail() != null) {
        user.setEmail(updatedUser.getEmail());
    }

    if (updatedUser.getDepartment() != null) {
        user.setDepartment(updatedUser.getDepartment());
    }

    // ✅ password update
    if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
        user.setPassword(updatedUser.getPassword()); // ⚠️ hash if using security
    }

    return userRepository.save(user);
}

public void deleteUser(Long id) {
    userRepository.deleteById(id);
}

}