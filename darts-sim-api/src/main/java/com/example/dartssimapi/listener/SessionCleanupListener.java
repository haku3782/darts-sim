package com.example.dartssimapi.listener;

import com.example.dartssimapi.service.SessionLogService;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;
import org.springframework.stereotype.Component;

@Component
public class SessionCleanupListener implements HttpSessionListener {

    private final SessionLogService sessionLogService;

    public SessionCleanupListener(SessionLogService sessionLogService) {
        this.sessionLogService = sessionLogService;
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent event) {
        String sessionId = event.getSession().getId();
        sessionLogService.deleteBySessionId(sessionId);
    }
}
