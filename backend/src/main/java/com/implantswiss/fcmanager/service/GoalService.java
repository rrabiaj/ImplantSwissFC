package com.implantswiss.fcmanager.service;

import com.implantswiss.fcmanager.dto.CreateGoalDto;
import com.implantswiss.fcmanager.dto.GoalDto;
import com.implantswiss.fcmanager.entity.Goal;
import com.implantswiss.fcmanager.entity.Player;
import com.implantswiss.fcmanager.exception.ResourceNotFoundException;
import com.implantswiss.fcmanager.repository.GoalRepository;
import com.implantswiss.fcmanager.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final PlayerRepository playerRepository;

    public List<GoalDto> getByMatch(Long matchId) {
        return goalRepository.findByMatchId(matchId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public GoalDto create(CreateGoalDto dto) {
        Player player = playerRepository.findById(dto.getPlayerId())
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + dto.getPlayerId()));

        Goal goal = new Goal();
        goal.setPlayerId(dto.getPlayerId());
        goal.setMatchId(dto.getMatchId());
        goal.setMinute(dto.getMinute());
        goal.setGoalScorer(player.getFullName());

        Goal saved = goalRepository.save(goal);

        GoalDto result = toDto(saved);
        result.setPlayerName(player.getFullName());
        return result;
    }

    public void delete(Long id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));
        goalRepository.delete(goal);
    }

    public GoalDto toDto(Goal goal) {
        GoalDto dto = new GoalDto();
        dto.setId(goal.getId());
        dto.setPlayerId(goal.getPlayerId());
        dto.setMatchId(goal.getMatchId());
        dto.setMinute(goal.getMinute());
        dto.setPlayerName(goal.getGoalScorer());
        return dto;
    }
}