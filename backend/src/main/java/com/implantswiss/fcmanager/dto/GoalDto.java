package com.implantswiss.fcmanager.dto;

import lombok.Data;

@Data
public class GoalDto {

    private Long id;
    private Long playerId;
    private String playerName;
    private Long matchId;
    private Integer minute;
}