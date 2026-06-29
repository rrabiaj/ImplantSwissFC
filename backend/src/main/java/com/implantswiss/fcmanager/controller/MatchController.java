package com.implantswiss.fcmanager.controller;

import com.implantswiss.fcmanager.dto.CreateMatchDto;
import com.implantswiss.fcmanager.dto.MatchDto;
import com.implantswiss.fcmanager.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH', 'PLAYER')")
    public ResponseEntity<List<MatchDto>> getAll(@RequestParam(required = false) Boolean completed) {
        return ResponseEntity.ok(matchService.getAll(completed));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH', 'PLAYER')")
    public ResponseEntity<MatchDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(matchService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<MatchDto> create(@Valid @RequestBody CreateMatchDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(matchService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<MatchDto> update(@PathVariable Long id, @Valid @RequestBody CreateMatchDto dto) {
        return ResponseEntity.ok(matchService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        matchService.delete(id);
        return ResponseEntity.noContent().build();
    }
}