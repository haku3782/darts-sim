package com.example.dartssimapi.dto;

import java.util.List;

/** シミュレーション結果レスポンス */
public record SimulationResponse(
    List<TrajectoryPoint> trajectory
) {}
