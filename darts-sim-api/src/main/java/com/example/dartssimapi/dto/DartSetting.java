package com.example.dartssimapi.dto;

import com.example.dartssimapi.model.FlightShape;

/** ダーツのセッティング条件 */
public record DartSetting(
    double weight,            // 総重量 (g)
    double centerOfGravity,   // 旧パラメータ（互換性のため残存）
    Double dragCoefficient,   // 旧パラメータ（null許容・互換性のため残存）
    FlightShape flightShape,  // フライト形状（空気抵抗の計算に使用）
    Double barrelLength,      // バレル長 (mm)。null時デフォルト 45.0mm
    Double shaftLength,       // シャフト長 (mm)。null時デフォルト 45.0mm
    Double cgRatio,           // 重心位置（先端からの割合%）。null時デフォルト 50.0%
    Double gripRatio          // グリップ位置（先端からの割合%）。null時はcgRatioと同じ
) {}
