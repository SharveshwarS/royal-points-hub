package com.vigor.points.controller;

import com.vigor.points.dto.ChatMessageDTO;
import com.vigor.points.entity.ChatMessage;
import com.vigor.points.service.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatController {

    private final ChatService service;

    public ChatController(ChatService service) {
        this.service = service;
    }

    // Send message
 @PostMapping("/send")
public ChatMessage sendMessage(@RequestBody ChatMessageDTO dto) {
    return service.sendMessage(dto);
}

    // Get chat between admin and employee
    @GetMapping("/conversation")
    public List<ChatMessage> getConversation(
            @RequestParam Long user1,
            @RequestParam Long user2
    ) {
        return service.getConversation(user1, user2);
    }
}