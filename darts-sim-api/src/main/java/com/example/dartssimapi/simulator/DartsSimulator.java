package com.example.dartssimapi.simulator;

import com.example.dartssimapi.dto.DartSetting;
import com.example.dartssimapi.dto.SimulationRequest;
import com.example.dartssimapi.dto.ThrowCondition;
import com.example.dartssimapi.dto.TrajectoryPoint;
import com.example.dartssimapi.model.FlightShape;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * ダーツ飛翔の物理シミュレーションエンジン。
 * 重力・空気抵抗・姿勢変化を計算し、軌道点のリストを返す。
 * DB操作は行わない。
 */
@Component
public class DartsSimulator {

    // 重力加速度 (m/s²)
    private static final double GRAVITY     = 9.80665;
    // タイムステップ (秒)
    private static final double TIME_STEP   = 0.005;
    // 空気密度 (kg/m³)
    private static final double AIR_DENSITY = 1.225;
    // フライトの空気抵抗係数 (無次元)
    private static final double FLIGHT_CD   = 1.1;
    // クロスフロー側面抵抗比率定数（力の計算に使用）
    private static final double K_SIDE      = 3.0;
    // 姿勢復元モーメント係数（K_SIDEより小さい値で現実的な復元力を再現）
    private static final double K_MOMENT    = 0.20;
    // チップ長さ (m)
    private static final double TIP_LENGTH  = 0.030;

    /**
     * シミュレーションを実行し、軌道点のリストを返す。
     *
     * @param request リクエストパラメータ（セッティング・スロー条件）
     * @return 軌道点のリスト（始点〜着弾点）
     */
    public List<TrajectoryPoint> simulate(SimulationRequest request) {
        List<TrajectoryPoint> trajectory = new ArrayList<>();

        DartSetting    setting   = request.dartSetting();
        ThrowCondition condition = request.throwCondition();

        // ── パラメータの取得と単位変換 ────────────────────────────────────
        double mass = setting.weight() / 1000.0; // g -> kg

        FlightShape flightShape = setting.flightShape();
        double flightArea = (flightShape != null) ? flightShape.getArea() : FlightShape.STANDARD.getArea();

        double speedMs  = condition.speed() / 3.6;          // km/h -> m/s
        double angleRad = Math.toRadians(condition.angle()); // 度 -> rad

        double targetX = condition.releaseDistance();
        double startY  = condition.releaseHeight();

        // ── 剛体パラメータ（null 時はデフォルト値を使用）──────────────────
        double barrelLengthMm = (setting.barrelLength() != null) ? setting.barrelLength() : 45.0;
        double shaftLengthMm  = (setting.shaftLength()  != null) ? setting.shaftLength()  : 45.0;
        double cgRatio        = (setting.cgRatio()       != null) ? setting.cgRatio()       : 50.0;

        // CG終端補正：チップだけ刺さる位置（バレル上端がボード面1cm手前、チップが2cm刺さる）
        double barrelTopYm = (cgRatio / 100.0) * (barrelLengthMm / 1000.0);
        targetX -= barrelTopYm + TIP_LENGTH;

        Double initialPitchParam = condition.initialPitch();
        double thetaP = (initialPitchParam != null) ? Math.toRadians(initialPitchParam) : angleRad;

        // ── 慣性モーメントの計算 ──────────────────────────────────────────
        // 圧力中心までの距離 l（CGからフライト）
        double lMm = (barrelLengthMm * (1.0 - cgRatio / 100.0)) + shaftLengthMm + 15.0;
        double l   = lMm / 1000.0;

        // シャフト・フライトの分散質量で慣性モーメントを近似
        double massShaft  = 0.0015; // kg（シャフト近似質量）
        double massFlight = 0.0005; // kg（フライト近似質量）
        double lShaft  = ((barrelLengthMm * (1.0 - cgRatio / 100.0)) + shaftLengthMm / 2.0) / 1000.0;
        double lFlight = l;
        double momentOfInertia = massShaft * lShaft * lShaft + massFlight * lFlight * lFlight;

        // ── 初期角速度の計算 ──────────────────────────────────────────────
        // グリップ位置がCGからずれていると、リリース時にわずかな回転が生じる。
        // RELEASE_FACTOR: 線形運動量のうち角運動量に変換される割合の経験係数。
        // 値が小さいほど「グリップずれの影響が小さい」現実的な挙動になる。
        // 実際のリリース時ωは 0.5〜3 rad/s 程度。
        final double RELEASE_FACTOR = 0.05;
        Double gripRatioParam = setting.gripRatio();
        double gripRatioValue = (gripRatioParam != null) ? gripRatioParam : cgRatio;
        double dGrip = (gripRatioValue - cgRatio) / 100.0 * barrelLengthMm / 1000.0;
        double omega = dGrip * speedMs * mass * RELEASE_FACTOR / momentOfInertia;

        // ── 初期状態の設定 (t = 0) ──────────────────────────────────────
        double t  = 0.0;
        double x  = 0.0;
        double y  = startY;
        double z  = 0.0;

        double vx = speedMs * Math.cos(angleRad);
        double vy = speedMs * Math.sin(angleRad);
        double vz = 0.0;

        trajectory.add(new TrajectoryPoint(t, x, y, z, thetaP));

        // ── メインループ ────────────────────────────────────────────────
        while (x < targetX && y > 0) {
            t += TIME_STEP;

            double v = Math.sqrt(vx * vx + vy * vy + vz * vz);

            if (v > 0) {
                // 迎角 (AoA) = 姿勢角 - 進行方向
                double thetaV = Math.atan2(vy, vx);
                double aoa    = thetaP - thetaV;

                // クロスフロー抗力モデルによる空気抵抗
                double cdEffective = FLIGHT_CD * (
                        Math.pow(Math.cos(aoa), 2) + K_SIDE * Math.pow(Math.sin(aoa), 2));
                double fd = 0.5 * AIR_DENSITY * v * v * cdEffective * flightArea;
                double ad = fd / mass;

                vx -= (ad * (vx / v)) * TIME_STEP;
                vy -= (ad * (vy / v)) * TIME_STEP;
                vz -= (ad * (vz / v)) * TIME_STEP;

                // 姿勢の復元運動（フライトが姿勢をまっすぐ戻そうとする）
                if (momentOfInertia > 0) {
                    double tauRestoring = -(0.5 * AIR_DENSITY * v * v * flightArea * K_MOMENT * Math.sin(aoa)) * l;
                    double cDamp        = 0.5 * AIR_DENSITY * flightArea * l * l * v;
                    double tauDamping   = -cDamp * omega;
                    double angularAccel = (tauRestoring + tauDamping) / momentOfInertia;
                    omega  += angularAccel * TIME_STEP;
                    thetaP += omega * TIME_STEP;
                }
            }

            vy -= GRAVITY * TIME_STEP;
            x  += vx * TIME_STEP;
            y  += vy * TIME_STEP;

            trajectory.add(new TrajectoryPoint(
                    Math.round(t * 1000.0) / 1000.0,
                    Math.round(x * 1000.0) / 1000.0,
                    Math.round(y * 1000.0) / 1000.0,
                    z,
                    Math.round(thetaP * 10000.0) / 10000.0));
        }

        // ── 着弾点の線形補間補正 ─────────────────────────────────────────
        // ボード面を通り過ぎた最後の点を、ちょうど targetX の位置に補正する
        if (trajectory.size() >= 2 && x >= targetX) {
            int lastIndex = trajectory.size() - 1;
            TrajectoryPoint p2 = trajectory.get(lastIndex);
            TrajectoryPoint p1 = trajectory.get(lastIndex - 1);

            double ratio     = (targetX - p1.x()) / (p2.x() - p1.x());
            double exactY    = p1.y() + (p2.y() - p1.y()) * ratio;
            double exactTime = p1.time() + (p2.time() - p1.time()) * ratio;

            trajectory.set(lastIndex, new TrajectoryPoint(
                    Math.round(exactTime * 1000.0) / 1000.0,
                    targetX,
                    Math.round(exactY * 1000.0) / 1000.0,
                    p2.z(),
                    p2.pitch()));
        }

        return trajectory;
    }
}
