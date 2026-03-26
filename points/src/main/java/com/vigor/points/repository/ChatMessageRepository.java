package com.vigor.points.repository;

import com.vigor.points.entity.ChatMessage;
import com.vigor.points.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findBySenderAndReceiverOrSenderAndReceiver(
            User sender1, User receiver1,
            User sender2, User receiver2
    );
}