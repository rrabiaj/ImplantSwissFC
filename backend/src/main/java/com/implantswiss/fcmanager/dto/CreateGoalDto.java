package com.implantswiss.fcmanager.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateGoalDto {

    @NotNull
    private Long playerId;

    @NotNull
    private Long matchId;

    @NotNull
    private Integer minute;
}