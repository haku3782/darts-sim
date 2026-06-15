package com.example.dartssimapi.dto;

import com.example.dartssimapi.model.GameRule;

/** シミュレーション実行リクエスト */
public record SimulationRequest(
    GameRule gameRule,
    DartSetting dartSetting,
    ThrowCondition throwCondition
) {}
