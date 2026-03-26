package com.vigor.points.service;

import com.vigor.points.dto.ChatMessageDTO;
import com.vigor.points.entity.ChatMessage;
import com.vigor.points.entity.User;
import com.vigor.points.repository.ChatMessageRepository;
import com.vigor.points.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    private final ChatMessageRepository chatRepo;
    private final UserRepository userRepo;

    public ChatService(ChatMessageRepository chatRepo, UserRepository userRepo) {
        this.chatRepo = chatRepo;
        this.userRepo = userRepo;
    }

public ChatMessage sendMessage(ChatMessageDTO dto) {

    User sender = userRepo.findById(dto.getSenderId())
            .orElseThrow(() -> new RuntimeException("Sender not found"));

    User receiver = userRepo.findById(dto.getReceiverId())
            .orElseThrow(() -> new RuntimeException("Receiver not found"));

    // 🔐 Role-based validation (STRING BASED)
    if (sender.getRole().equalsIgnoreCase("EMPLOYEE") &&
        receiver.getRole().equalsIgnoreCase("EMPLOYEE")) {

        throw new RuntimeException("Employees can only message Admin");
    }

    ChatMessage message = ChatMessage.builder()
            .sender(sender)
            .receiver(receiver)
            .message(dto.getMessage())
            .timestamp(LocalDateTime.now())
            .build();

    return chatRepo.save(message);
}

    public List<ChatMessage> getConversation(Long user1Id, Long user2Id) {

        User user1 = userRepo.findById(user1Id)
                .orElseThrow(() -> new RuntimeException("User1 not found"));

        User user2 = userRepo.findById(user2Id)
                .orElseThrow(() -> new RuntimeException("User2 not found"));

        return chatRepo.findBySenderAndReceiverOrSenderAndReceiver(
                user1, user2,
                user2, user1
        );
    }
}