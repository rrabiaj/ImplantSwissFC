package com.implantswiss.fcmanager.service;

import com.implantswiss.fcmanager.dto.CreatePlayerDto;
import com.implantswiss.fcmanager.dto.PlayerDto;
import com.implantswiss.fcmanager.dto.UpdatePlayerDto;
import com.implantswiss.fcmanager.entity.Player;
import com.implantswiss.fcmanager.exception.ResourceNotFoundException;
import com.implantswiss.fcmanager.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;

    public List<Player> getAll(String position) {
        if (position != null && !position.isBlank()) {
            return playerRepository.findByPosition(position);
        }
        return playerRepository.findAll();
    }

    public Player getById(Long id) {
        return playerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + id));
    }

    public Player create(CreatePlayerDto dto) {
        Player player = new Player();
        player.setFullName(dto.getFullName());
        player.setPosition(dto.getPosition());
        player.setShirtNumber(dto.getShirtNumber());
        player.setIsActive(true);
        return playerRepository.save(player);
    }

    public Player update(Long id, UpdatePlayerDto dto) {
        Player player = getById(id);
        if (dto.getFullName() != null) player.setFullName(dto.getFullName());
        if (dto.getPosition() != null) player.setPosition(dto.getPosition());
        if (dto.getShirtNumber() != null) player.setShirtNumber(dto.getShirtNumber());
        if (dto.getIsActive() != null) player.setIsActive(dto.getIsActive());
        return playerRepository.save(player);
    }

    public void delete(Long id) {
        Player player = getById(id);
        playerRepository.delete(player);
    }

    public PlayerDto toDto(Player player) {
        PlayerDto dto = new PlayerDto();
        dto.setId(player.getId());
        dto.setFullName(player.getFullName());
        dto.setPosition(player.getPosition());
        dto.setShirtNumber(player.getShirtNumber());
        dto.setIsActive(player.getIsActive());
        dto.setCreatedAt(player.getCreatedAt());
        return dto;
    }
}