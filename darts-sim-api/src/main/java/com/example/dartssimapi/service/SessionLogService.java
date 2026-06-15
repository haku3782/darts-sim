package com.example.dartssimapi.service;

import com.example.dartssimapi.entity.SessionLog;
import com.example.dartssimapi.repository.SessionLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SessionLogService {

    private final SessionLogRepository sessionLogRepository;

    public SessionLogService(SessionLogRepository sessionLogRepository) {
        this.sessionLogRepository = sessionLogRepository;
    }

    @Transactional
    public void save(String sessionId, String logContent) {
        SessionLog log = new SessionLog(sessionId, logContent);
        sessionLogRepository.save(log);
    }

    @Transactional
    public void deleteBySessionId(String sessionId) {
        sessionLogRepository.deleteBySessionId(sessionId);
    }

    public List<SessionLog> findBySessionId(String sessionId) {
        return sessionLogRepository.findBySessionId(sessionId);
    }
}
