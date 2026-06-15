package com.example.dartssimapi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;

@Entity
public class SimulationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sessionId; // セッションID

    private double initialVelocity; // 初速 (m/s)
    private double angle;           // 射出角度 (rad)
    private double drag;            // 空気抵抗係数

    @Column(columnDefinition = "TEXT")
    private String trajectoryJson; // 軌道データ（JSON文字列）

    @Column(name = "release_distance")
    private double releaseDistance; // リリース距離 (m, ボードから)

    @Column(name = "game_rule")
    private String gameRule; // ゲームルール (SOFT / HARD)

    private LocalDateTime createdAt; // 実行日時

    // ── セッティング条件 ──────────────────────────────────────
    @Column(name = "flight_shape")
    private String flightShape;    // フライト形状

    @Column(name = "barrel_length")
    private double barrelLength;   // バレル長 (mm)

    @Column(name = "shaft_length")
    private double shaftLength;    // シャフト長 (mm)

    @Column(name = "weight")
    private double weight;         // バレル重量 (g)

    @Column(name = "cg_ratio")
    private double cgRatio;        // 重心位置 (%)

    // ── スロー条件 ────────────────────────────────────────────
    @Column(name = "grip_ratio")
    private double gripRatio;      // グリップ位置 (%)

    @Column(name = "release_height")
    private double releaseHeight;  // リリース高さ (m)

    @Column(name = "initial_pitch")
    private double initialPitch;   // 初期姿勢角度 (度)

    // JPAの仕様上、引数のない空のコンストラクタが必須です
    public SimulationRecord() {
    }

    // データ保存時に使うコンストラクタ
    public SimulationRecord(String sessionId, double initialVelocity, double angle, double drag,
                            String trajectoryJson, double releaseDistance, String gameRule,
                            String flightShape, double barrelLength, double shaftLength,
                            double weight, double cgRatio,
                            double gripRatio, double releaseHeight, double initialPitch) {
        this.sessionId = sessionId;
        this.initialVelocity = initialVelocity;
        this.angle = angle;
        this.drag = drag;
        this.trajectoryJson = trajectoryJson;
        this.releaseDistance = releaseDistance;
        this.gameRule = gameRule;
        this.flightShape = flightShape;
        this.barrelLength = barrelLength;
        this.shaftLength = shaftLength;
        this.weight = weight;
        this.cgRatio = cgRatio;
        this.gripRatio = gripRatio;
        this.releaseHeight = releaseHeight;
        this.initialPitch = initialPitch;
        this.createdAt = LocalDateTime.now();
    }

    // --- 以下、Getter ---
    public Long getId() { return id; }
    public String getSessionId() { return sessionId; }
    public double getInitialVelocity() { return initialVelocity; }
    public double getAngle() { return angle; }
    public double getDrag() { return drag; }
    public String getTrajectoryJson() { return trajectoryJson; }
    public double getReleaseDistance() { return releaseDistance; }
    public String getGameRule() { return gameRule; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getFlightShape() { return flightShape; }
    public double getBarrelLength() { return barrelLength; }
    public double getShaftLength() { return shaftLength; }
    public double getWeight() { return weight; }
    public double getCgRatio() { return cgRatio; }
    public double getGripRatio() { return gripRatio; }
    public double getReleaseHeight() { return releaseHeight; }
    public double getInitialPitch() { return initialPitch; }
}
