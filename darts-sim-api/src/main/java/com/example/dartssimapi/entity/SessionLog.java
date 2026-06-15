package com.example.dartssimapi.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "session_logs")
public class SessionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false)
    private String sessionId;

    @Column(name = "log_content", nullable = false)
    private String logContent;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public SessionLog() {}

    public SessionLog(String sessionId, String logContent) {
        this.sessionId = sessionId;
        this.logContent = logContent;
    }

    public Long getId() { return id; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getLogContent() { return logContent; }
    public void setLogContent(String logContent) { this.logContent = logContent; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
