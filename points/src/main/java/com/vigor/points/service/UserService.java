package com.vigor.points.service;
import java.util.List;
import org.springframework.stereotype.Service;

import com.vigor.points.entity.User;
import com.vigor.points.repository.UserRepository;
 import com.vigor.points.repository.PointsTransactionRepository;

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

    user.setName(updatedUser.getName());
    user.setEmail(updatedUser.getEmail());
    user.setDepartment(updatedUser.getDepartment());

    return userRepository.save(user);
}

public void deleteUser(Long id) {
    userRepository.deleteById(id);
}

}