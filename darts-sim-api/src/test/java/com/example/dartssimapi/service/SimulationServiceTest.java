package com.example.dartssimapi.service;

import com.example.dartssimapi.dto.DartSetting;
import com.example.dartssimapi.dto.SimulationRequest;
import com.example.dartssimapi.dto.SimulationResponse;
import com.example.dartssimapi.dto.ThrowCondition;
import com.example.dartssimapi.entity.SimulationRecord;
import com.example.dartssimapi.model.FlightShape;
import com.example.dartssimapi.model.GameRule;
import com.example.dartssimapi.repository.SimulationRecordRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * SimulationService のDB操作を含む結合テスト。
 * H2インメモリDBを使用するため、PostgreSQLへの接続不要。
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class SimulationServiceTest {

    @Autowired
    private SimulationService simulationService;

    @Autowired
    private SimulationRecordRepository repository;

    private static final String SESSION_A = "session-a";
    private static final String SESSION_B = "session-b";

    private SimulationRequest buildRequest(GameRule rule) {
        DartSetting setting = new DartSetting(
            20.0, 0.0, null, FlightShape.STANDARD,
            45.0, 26.0, 50.0, 51.0
        );
        ThrowCondition condition = new ThrowCondition(
            24.0, 18.0, 1.70, 2.44, 18.0
        );
        return new SimulationRequest(rule, setting, condition);
    }

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    // ── runSimulation ────────────────────────────────────────────────────

    @Test
    void runSimulation_軌道が返される() {
        SimulationResponse response = simulationService.runSimulation(buildRequest(GameRule.SOFT), SESSION_A);
        assertThat(response.trajectory()).isNotEmpty();
    }

    @Test
    void runSimulation_DBに1件保存される() {
        simulationService.runSimulation(buildRequest(GameRule.SOFT), SESSION_A);
        assertThat(repository.findBySessionIdOrderByCreatedAtDesc(SESSION_A)).hasSize(1);
    }

    @Test
    void runSimulation_ゲームルールが正しく保存される() {
        simulationService.runSimulation(buildRequest(GameRule.HARD), SESSION_A);
        List<SimulationRecord> records = repository.findBySessionIdOrderByCreatedAtDesc(SESSION_A);
        assertThat(records.get(0).getGameRule()).isEqualTo("HARD");
    }

    // ── getHistory ───────────────────────────────────────────────────────

    @Test
    void getHistory_同一セッションの履歴のみ返す() {
        simulationService.runSimulation(buildRequest(GameRule.SOFT), SESSION_A);
        simulationService.runSimulation(buildRequest(GameRule.SOFT), SESSION_B);

        List<SimulationRecord> result = simulationService.getHistory(SESSION_A);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getSessionId()).isEqualTo(SESSION_A);
    }

    @Test
    void getHistory_複数件取得できる() {
        simulationService.runSimulation(buildRequest(GameRule.SOFT), SESSION_A);
        simulationService.runSimulation(buildRequest(GameRule.HARD), SESSION_A);

        assertThat(simulationService.getHistory(SESSION_A)).hasSize(2);
    }

    // ── deleteBySession ──────────────────────────────────────────────────

    @Test
    void deleteBySession_セッションの全履歴が削除される() {
        simulationService.runSimulation(buildRequest(GameRule.SOFT), SESSION_A);
        simulationService.runSimulation(buildRequest(GameRule.HARD), SESSION_A);

        simulationService.deleteBySession(SESSION_A);

        assertThat(simulationService.getHistory(SESSION_A)).isEmpty();
    }

    @Test
    void deleteBySession_他のセッションは削除されない() {
        simulationService.runSimulation(buildRequest(GameRule.SOFT), SESSION_A);
        simulationService.runSimulation(buildRequest(GameRule.SOFT), SESSION_B);

        simulationService.deleteBySession(SESSION_A);

        assertThat(simulationService.getHistory(SESSION_B)).hasSize(1);
    }

    // ── deleteBySessionAndRule ───────────────────────────────────────────

    @Test
    void deleteBySessionAndRule_指定ルールのみ削除される() {
        simulationService.runSimulation(buildRequest(GameRule.SOFT), SESSION_A);
        simulationService.runSimulation(buildRequest(GameRule.HARD), SESSION_A);

        simulationService.deleteBySessionAndRule(SESSION_A, "SOFT");

        List<SimulationRecord> remaining = simulationService.getHistory(SESSION_A);
        assertThat(remaining).hasSize(1);
        assertThat(remaining.get(0).getGameRule()).isEqualTo("HARD");
    }

    // ── deleteById ───────────────────────────────────────────────────────

    @Test
    void deleteById_同一セッションのレコードが削除される() {
        simulationService.runSimulation(buildRequest(GameRule.SOFT), SESSION_A);
        Long id = simulationService.getHistory(SESSION_A).get(0).getId();

        simulationService.deleteById(SESSION_A, id);

        assertThat(simulationService.getHistory(SESSION_A)).isEmpty();
    }

    @Test
    void deleteById_別セッションのIDは削除されない() {
        simulationService.runSimulation(buildRequest(GameRule.SOFT), SESSION_A);
        Long id = simulationService.getHistory(SESSION_A).get(0).getId();

        // SESSION_B でSESSION_AのIDを削除しようとする → 削除されない
        simulationService.deleteById(SESSION_B, id);

        assertThat(simulationService.getHistory(SESSION_A)).hasSize(1);
    }
}
