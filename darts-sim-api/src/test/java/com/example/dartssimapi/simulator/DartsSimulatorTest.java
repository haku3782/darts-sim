package com.example.dartssimapi.simulator;

import com.example.dartssimapi.dto.DartSetting;
import com.example.dartssimapi.dto.SimulationRequest;
import com.example.dartssimapi.dto.ThrowCondition;
import com.example.dartssimapi.dto.TrajectoryPoint;
import com.example.dartssimapi.model.FlightShape;
import com.example.dartssimapi.model.GameRule;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * DartsSimulator の物理計算ロジックをテストする。
 */
@SpringBootTest
@ActiveProfiles("test")
class DartsSimulatorTest {

    @Autowired
    private DartsSimulator simulator;

    /** 標準的なスロー条件でリクエストを生成するヘルパー */
    private SimulationRequest buildRequest(double speedKmh, double angleDeg) {
        DartSetting setting = new DartSetting(
            20.0,               // 重量 (g)
            0.0,                // centerOfGravity（旧パラメータ）
            null,               // dragCoefficient（旧パラメータ）
            FlightShape.STANDARD,
            45.0,               // バレル長 (mm)
            26.0,               // シャフト長 (mm)
            50.0,               // CG位置 (%)
            51.0                // グリップ位置 (%)
        );
        ThrowCondition condition = new ThrowCondition(
            speedKmh,           // 初速 (km/h)
            angleDeg,           // 射出角 (度)
            1.70,               // リリース高さ (m)
            2.44,               // リリース距離 (m)
            angleDeg            // 初期姿勢角 (度)
        );
        return new SimulationRequest(GameRule.SOFT, setting, condition);
    }

    @Test
    void 軌道が空でない() {
        List<TrajectoryPoint> result = simulator.simulate(buildRequest(24.0, 18.0));
        assertThat(result).isNotEmpty();
    }

    @Test
    void 始点のX座標がゼロ() {
        List<TrajectoryPoint> result = simulator.simulate(buildRequest(24.0, 18.0));
        assertThat(result.get(0).x()).isEqualTo(0.0);
    }

    @Test
    void 始点のY座標がリリース高さと一致() {
        List<TrajectoryPoint> result = simulator.simulate(buildRequest(24.0, 18.0));
        assertThat(result.get(0).y()).isEqualTo(1.70);
    }

    @Test
    void 終点のY座標が正の値_地面に落ちていない() {
        List<TrajectoryPoint> result = simulator.simulate(buildRequest(24.0, 18.0));
        TrajectoryPoint last = result.get(result.size() - 1);
        assertThat(last.y()).isGreaterThan(0.0);
    }

    @Test
    void 最低50点以上の軌道点が生成される() {
        List<TrajectoryPoint> result = simulator.simulate(buildRequest(24.0, 18.0));
        assertThat(result).hasSizeGreaterThanOrEqualTo(50);
    }

    @Test
    void 低速でも軌道が生成される() {
        List<TrajectoryPoint> result = simulator.simulate(buildRequest(15.0, 10.0));
        assertThat(result).isNotEmpty();
    }

    @Test
    void 時刻が単調増加している() {
        List<TrajectoryPoint> result = simulator.simulate(buildRequest(24.0, 18.0));
        for (int i = 1; i < result.size(); i++) {
            assertThat(result.get(i).time()).isGreaterThanOrEqualTo(result.get(i - 1).time());
        }
    }
}
