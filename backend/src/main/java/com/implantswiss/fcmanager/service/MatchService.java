package com.implantswiss.fcmanager.service;

import com.implantswiss.fcmanager.dto.CreateMatchDto;
import com.implantswiss.fcmanager.dto.MatchDto;
import com.implantswiss.fcmanager.entity.Match;
import com.implantswiss.fcmanager.exception.ResourceNotFoundException;
import com.implantswiss.fcmanager.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;

    public List<MatchDto> getAll(Boolean completed) {
        List<Match> matches;
        if (completed != null) {
            matches = matchRepository.findByIsCompleted(completed);
        } else {
            matches = matchRepository.findAll();
        }
        return matches.stream().map(this::toDto).collect(Collectors.toList());
    }

    public MatchDto getById(Long id) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with id: " + id));
        return toDto(match);
    }

    public MatchDto create(CreateMatchDto dto) {
        Match match = new Match();
        match.setOpponent(dto.getOpponent());
        match.setMatchDate(dto.getMatchDate() != null ? dto.getMatchDate().toLocalDate() : null);
        match.setHomeScore(dto.getHomeScore());
        match.setAwayScore(dto.getAwayScore());
        match.setIsCompleted(dto.getIsCompleted() != null ? dto.getIsCompleted() : false);
        return toDto(matchRepository.save(match));
    }

    public MatchDto update(Long id, CreateMatchDto dto) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with id: " + id));
        match.setOpponent(dto.getOpponent());
        if (dto.getMatchDate() != null) match.setMatchDate(dto.getMatchDate().toLocalDate());
        if (dto.getHomeScore() != null) match.setHomeScore(dto.getHomeScore());
        if (dto.getAwayScore() != null) match.setAwayScore(dto.getAwayScore());
        if (dto.getIsCompleted() != null) match.setIsCompleted(dto.getIsCompleted());
        return toDto(matchRepository.save(match));
    }

    public void delete(Long id) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with id: " + id));
        matchRepository.delete(match);
    }

    public MatchDto toDto(Match match) {
        MatchDto dto = new MatchDto();
        dto.setId(match.getId());
        dto.setOpponent(match.getOpponent());
        dto.setMatchDate(match.getMatchDate() != null ? match.getMatchDate().atStartOfDay() : null);
        dto.setHomeScore(match.getHomeScore());
        dto.setAwayScore(match.getAwayScore());
        dto.setIsCompleted(match.getIsCompleted());
        return dto;
    }
}