package com.implantswiss.fcmanager.controller;

import com.implantswiss.fcmanager.dto.CreateGoalDto;
import com.implantswiss.fcmanager.dto.GoalDto;
import com.implantswiss.fcmanager.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @GetMapping("/match/{matchId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH', 'PLAYER')")
    public ResponseEntity<List<GoalDto>> getByMatch(@PathVariable Long matchId) {
        return ResponseEntity.ok(goalService.getByMatch(matchId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<GoalDto> create(@Valid @RequestBody CreateGoalDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(goalService.create(dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        goalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}