package com.implantswiss.fcmanager.repository;

import com.implantswiss.fcmanager.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByIsCompleted(Boolean isCompleted);
    List<Match> findByOpponent(String opponent);
}