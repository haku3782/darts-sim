package com.example.dartssimapi.dto;

/** スロー条件 */
public record ThrowCondition(
    double speed,           // 初速 (km/h)
    double angle,           // 射出角度 (度)
    double releaseHeight,   // リリース高さ (m)
    double releaseDistance, // リリース距離 (m, ボード面からの距離)
    Double initialPitch     // 初期姿勢角度 (度)。null時は投射角度と同一（初期AoA=0）
) {}
