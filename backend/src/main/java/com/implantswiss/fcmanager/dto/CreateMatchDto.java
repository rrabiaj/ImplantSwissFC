package com.implantswiss.fcmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateMatchDto {

    @NotBlank
    private String opponent;

    @NotNull
    private LocalDateTime matchDate;

    private Integer homeScore;
    private Integer awayScore;
    private Boolean isCompleted;
}