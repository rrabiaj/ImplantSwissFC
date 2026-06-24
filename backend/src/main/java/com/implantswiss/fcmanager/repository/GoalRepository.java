package com.implantswiss.fcmanager.repository;

import com.implantswiss.fcmanager.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByMatchId(Long matchId);
    List<Goal> findByPlayerId(Long playerId);
    long countByPlayerId(Long playerId);
}