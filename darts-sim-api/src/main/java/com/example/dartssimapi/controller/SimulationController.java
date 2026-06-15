package com.example.dartssimapi.controller;

import com.example.dartssimapi.dto.SimulationRequest;
import com.example.dartssimapi.dto.SimulationResponse;
import com.example.dartssimapi.entity.SimulationRecord;
import com.example.dartssimapi.entity.SessionLog;
import com.example.dartssimapi.service.SessionLogService;
import com.example.dartssimapi.service.SimulationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
// 本番用
@CrossOrigin(origins = {
    "https://darts-sim-web.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174"
}, allowCredentials = "true")
public class SimulationController {

    private final SimulationService simulationService;
    private final SessionLogService sessionLogService;

    public SimulationController(SimulationService simulationService,
                                SessionLogService sessionLogService) {
        this.simulationService = simulationService;
        this.sessionLogService = sessionLogService;
    }

    @PostMapping("/simulate")
    public ResponseEntity<SimulationResponse> simulate(
            @RequestBody SimulationRequest request,
            HttpServletRequest httpRequest) {
        String sessionId = httpRequest.getSession().getId();
        sessionLogService.save(sessionId, "POST /api/simulate");
        return ResponseEntity.ok(simulationService.runSimulation(request, sessionId));
    }

    @GetMapping("/history")
    public List<SimulationRecord> getHistory(HttpServletRequest httpRequest) {
        String sessionId = httpRequest.getSession().getId();
        sessionLogService.save(sessionId, "GET /api/history");
        return simulationService.getHistory(sessionId);
    }

    @DeleteMapping("/history")
    public ResponseEntity<Void> deleteHistory(
            @RequestParam(required = false) String gameRule,
            HttpServletRequest httpRequest) {
        String sessionId = httpRequest.getSession().getId();
        if (gameRule != null) {
            simulationService.deleteBySessionAndRule(sessionId, gameRule);
        } else {
            simulationService.deleteBySession(sessionId);
        }
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/history/{id}")
    public ResponseEntity<Void> deleteHistoryById(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        String sessionId = httpRequest.getSession().getId();
        simulationService.deleteById(sessionId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/session-logs")
    public List<SessionLog> getSessionLogs(HttpServletRequest httpRequest) {
        String sessionId = httpRequest.getSession().getId();
        return sessionLogService.findBySessionId(sessionId);
    }
}
