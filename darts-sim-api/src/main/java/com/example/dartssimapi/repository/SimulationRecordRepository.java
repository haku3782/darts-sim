package com.example.dartssimapi.repository;

import com.example.dartssimapi.entity.SimulationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface SimulationRecordRepository extends JpaRepository<SimulationRecord, Long> {

    List<SimulationRecord> findBySessionIdOrderByCreatedAtDesc(String sessionId);

    @Modifying
    @Transactional
    void deleteBySessionId(String sessionId);

    @Modifying
    @Transactional
    void deleteBySessionIdAndGameRule(String sessionId, String gameRule);
}