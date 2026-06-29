package com.implantswiss.fcmanager.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MatchDto {

    private Long id;
    private String opponent;
    private LocalDateTime matchDate;
    private Integer homeScore;
    private Integer awayScore;
    private Boolean isCompleted;
}