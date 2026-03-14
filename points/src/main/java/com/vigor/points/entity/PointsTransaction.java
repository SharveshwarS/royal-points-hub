package com.vigor.points.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class PointsTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private int points;

    private String type; // ADD or DEDUCT

    private String reason;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }

    public Long getUserId() { return userId; }

    public void setUserId(Long userId) { this.userId = userId; }

    public int getPoints() { return points; }

    public void setPoints(int points) { this.points = points; }

    public String getType() { return type; }

    public void setType(String type) { this.type = type; }

    public String getReason() { return reason; }

    public void setReason(String reason) { this.reason = reason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}