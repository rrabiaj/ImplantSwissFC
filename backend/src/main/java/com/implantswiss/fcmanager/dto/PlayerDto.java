package com.implantswiss.fcmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerDto {

    private Long id;
    private String fullName;
    private String position;
    private Integer shirtNumber;
    private Boolean isActive;
    private LocalDateTime createdAt;
}