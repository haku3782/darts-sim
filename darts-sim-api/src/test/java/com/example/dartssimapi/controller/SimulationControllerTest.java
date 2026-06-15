package com.example.dartssimapi.controller;

import com.example.dartssimapi.dto.DartSetting;
import com.example.dartssimapi.dto.SimulationRequest;
import com.example.dartssimapi.dto.SimulationResponse;
import com.example.dartssimapi.dto.ThrowCondition;
import com.example.dartssimapi.dto.TrajectoryPoint;
import com.example.dartssimapi.model.FlightShape;
import com.example.dartssimapi.model.GameRule;
import com.example.dartssimapi.service.SessionLogService;
import com.example.dartssimapi.service.SimulationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * SimulationController の APIエンドポイントをテストする。
 * Service は Mock に差し替えるため DB 接続不要。
 */
@WebMvcTest(SimulationController.class)
class SimulationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private SimulationService simulationService;

    @MockitoBean
    private SessionLogService sessionLogService;

    private SimulationRequest buildRequest() {
        DartSetting setting = new DartSetting(
            20.0, 0.0, null, FlightShape.STANDARD,
            45.0, 26.0, 50.0, 51.0
        );
        ThrowCondition condition = new ThrowCondition(24.0, 18.0, 1.70, 2.44, 18.0);
        return new SimulationRequest(GameRule.SOFT, setting, condition);
    }

    @Test
    void POST_simulate_200とtrajectoryを返す() throws Exception {
        List<TrajectoryPoint> points = List.of(
            new TrajectoryPoint(0.0, 0.0, 1.70, 0.0, 0.314),
            new TrajectoryPoint(0.1, 0.5, 1.72, 0.0, 0.310)
        );
        when(simulationService.runSimulation(any(), anyString()))
            .thenReturn(new SimulationResponse(points));

        mockMvc.perform(post("/api/simulate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(buildRequest())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.trajectory").isArray())
            .andExpect(jsonPath("$.trajectory.length()").value(2))
            .andExpect(jsonPath("$.trajectory[0].x").value(0.0))
            .andExpect(jsonPath("$.trajectory[0].y").value(1.70));
    }

    @Test
    void GET_history_200と空配列を返す() throws Exception {
        when(simulationService.getHistory(anyString())).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/history"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void DELETE_history_204を返す() throws Exception {
        mockMvc.perform(delete("/api/history"))
            .andExpect(status().isNoContent());
    }

    @Test
    void DELETE_history_gameRule指定で204を返す() throws Exception {
        mockMvc.perform(delete("/api/history").param("gameRule", "SOFT"))
            .andExpect(status().isNoContent());
    }
}
