package com.example.dartssimapi.dto;

/** 軌道上の1点 */
public record TrajectoryPoint(
    double time,  // 経過時間 (秒)
    double x,     // X軸位置 (m, リリース位置からボード方向)
    double y,     // Y軸位置 (m, 高さ)
    double z,     // Z軸位置 (m, 左右ブレ)
    Double pitch  // 姿勢角度 (ラジアン)。旧レコードとの後方互換のため null 許容
) {}
