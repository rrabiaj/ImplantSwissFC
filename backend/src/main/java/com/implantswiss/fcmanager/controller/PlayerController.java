package com.implantswiss.fcmanager.controller;

import com.implantswiss.fcmanager.dto.CreatePlayerDto;
import com.implantswiss.fcmanager.dto.PlayerDto;
import com.implantswiss.fcmanager.dto.UpdatePlayerDto;
import com.implantswiss.fcmanager.service.PlayerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @GetMapping
    public ResponseEntity<List<PlayerDto>> getAll(@RequestParam(required = false) String position) {
        List<PlayerDto> players = playerService.getAll(position)
                .stream()
                .map(playerService::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(players);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(playerService.toDto(playerService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<PlayerDto> create(@Valid @RequestBody CreatePlayerDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(playerService.toDto(playerService.create(dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<PlayerDto> update(@PathVariable Long id, @Valid @RequestBody UpdatePlayerDto dto) {
        return ResponseEntity.ok(playerService.toDto(playerService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        playerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}