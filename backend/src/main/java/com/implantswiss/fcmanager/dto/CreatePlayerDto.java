package com.implantswiss.fcmanager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreatePlayerDto {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Position is required")
    private String position;

    private Integer shirtNumber;
}