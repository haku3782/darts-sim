package com.example.dartssimapi.service;

import com.example.dartssimapi.dto.DartSetting;
import com.example.dartssimapi.dto.SimulationRequest;
import com.example.dartssimapi.dto.SimulationResponse;
import com.example.dartssimapi.dto.ThrowCondition;
import com.example.dartssimapi.dto.TrajectoryPoint;
import com.example.dartssimapi.entity.SimulationRecord;
import com.example.dartssimapi.model.FlightShape;
import com.example.dartssimapi.repository.SimulationRecordRepository;
import com.example.dartssimapi.simulator.DartsSimulator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * シミュレーション結果の保存・履歴管理を担当するサービス。
 * 物理計算は DartsSimulator に委譲する。
 */
@Service
public class SimulationService {

    private final SimulationRecordRepository repository;
    private final DartsSimulator simulator;

    public SimulationService(SimulationRecordRepository repository, DartsSimulator simulator) {
        this.repository = repository;
        this.simulator  = simulator;
    }

    /** シミュレーションを実行し、結果をDBに保存して返す */
    public SimulationResponse runSimulation(SimulationRequest request, String sessionId) {
        List<TrajectoryPoint> trajectory = simulator.simulate(request);
        saveRecord(request, sessionId, trajectory);
        return new SimulationResponse(trajectory);
    }

    /** セッションIDに紐づく履歴を新しい順で取得する */
    public List<SimulationRecord> getHistory(String sessionId) {
        return repository.findBySessionIdOrderByCreatedAtDesc(sessionId);
    }

    /** セッションIDに紐づく履歴をすべて削除する */
    public void deleteBySession(String sessionId) {
        repository.deleteBySessionId(sessionId);
    }

    /** セッションIDとゲームルールに紐づく履歴を削除する */
    public void deleteBySessionAndRule(String sessionId, String gameRule) {
        repository.deleteBySessionIdAndGameRule(sessionId, gameRule);
    }

    /** セッションIDと一致する特定レコードを削除する */
    public void deleteById(String sessionId, Long id) {
        repository.findById(id).ifPresent(record -> {
            if (record.getSessionId().equals(sessionId)) {
                repository.deleteById(id);
            }
        });
    }

    // ── private ──────────────────────────────────────────────────────────

    private void saveRecord(SimulationRequest request, String sessionId, List<TrajectoryPoint> trajectory) {
        try {
            DartSetting    setting   = request.dartSetting();
            ThrowCondition condition = request.throwCondition();

            FlightShape flightShape     = setting.flightShape();
            String      flightShapeName = (flightShape != null) ? flightShape.name() : FlightShape.STANDARD.name();

            double barrelLength = (setting.barrelLength()    != null) ? setting.barrelLength()    : 45.0;
            double shaftLength  = (setting.shaftLength()     != null) ? setting.shaftLength()     : 45.0;
            double cgRatio      = (setting.cgRatio()          != null) ? setting.cgRatio()          : 50.0;
            double gripRatio    = (setting.gripRatio()        != null) ? setting.gripRatio()        : cgRatio;
            double initialPitch = (condition.initialPitch()  != null) ? condition.initialPitch()  : condition.angle();
            double drag         = (setting.dragCoefficient() != null) ? setting.dragCoefficient() : 0.0;

            double speedMs  = condition.speed() / 3.6;
            double angleRad = Math.toRadians(condition.angle());

            String trajectoryJson = new ObjectMapper().writeValueAsString(trajectory);

            SimulationRecord record = new SimulationRecord(
                    sessionId, speedMs, angleRad, drag,
                    trajectoryJson,
                    condition.releaseDistance(),
                    request.gameRule().name(),
                    flightShapeName,
                    barrelLength, shaftLength,
                    setting.weight(), cgRatio,
                    gripRatio,
                    condition.releaseHeight(),
                    initialPitch);
            repository.save(record);
        } catch (Exception e) {
            throw new RuntimeException("軌道データの保存に失敗しました", e);
        }
    }
}
