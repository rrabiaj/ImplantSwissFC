package com.implantswiss.fcmanager.repository;

import com.implantswiss.fcmanager.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByPosition(String position);
    List<Player> findByIsActive(Boolean isActive);
}