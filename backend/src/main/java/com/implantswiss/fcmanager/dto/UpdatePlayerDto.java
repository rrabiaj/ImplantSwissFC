package com.implantswiss.fcmanager.dto;

import lombok.Data;

@Data
public class UpdatePlayerDto {

    private String fullName;
    private String position;
    private Integer shirtNumber;
    private Boolean isActive;
}