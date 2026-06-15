package com.example.dartssimapi.repository;

import com.example.dartssimapi.entity.SessionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SessionLogRepository extends JpaRepository<SessionLog, Long> {

    @Modifying
    @Query("DELETE FROM SessionLog s WHERE s.sessionId = :sessionId")
    void deleteBySessionId(@Param("sessionId") String sessionId);

    List<SessionLog> findBySessionId(String sessionId);
}
