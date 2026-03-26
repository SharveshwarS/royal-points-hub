package com.vigor.points.dto;

import lombok.Data;

@Data
public class ChatMessageDTO {
    private Long senderId;
    private Long receiverId;
    private String message;
}