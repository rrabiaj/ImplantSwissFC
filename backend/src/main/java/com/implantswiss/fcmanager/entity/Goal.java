package com.implantswiss.fcmanager.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "goals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "goal_scorer", nullable = false)
    private String goalScorer;

    @Column(name = "player_id", nullable = false)
    private Long playerId;

    @Column(name = "match_id", nullable = false)
    private Long matchId;

    @Column(nullable = false)
    private Integer minute;
}