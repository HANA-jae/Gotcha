package com.picklab.gotcha.service;

import com.picklab.gotcha.dto.GachaItemDTO;
import com.picklab.gotcha.dto.SimulateResultDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class SimulateService {

    private final GameService gameService;
    private static final Random random = new Random();

    public SimulateResultDTO simulate(Long boxId) {
        List<GachaItemDTO> items = gameService.getItemsByBoxId(boxId);

        if (items.isEmpty()) {
            throw new RuntimeException("No items found in box");
        }

        // 확률 합계 검증
        BigDecimal totalProbability = items.stream()
                .map(GachaItemDTO::getProbability)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalProbability.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new RuntimeException("Total probability exceeds 100%");
        }

        // 가중치 기반 선택
        double randomValue = random.nextDouble() * 100;
        double cumulativeProbability = 0;

        for (GachaItemDTO item : items) {
            cumulativeProbability += item.getProbability().doubleValue();
            if (randomValue <= cumulativeProbability) {
                return SimulateResultDTO.builder()
                        .itemId(item.getId())
                        .name(item.getName())
                        .grade(item.getGrade())
                        .imageUrl(item.getImageUrl())
                        .build();
            }
        }

        // Fallback to last item
        GachaItemDTO lastItem = items.get(items.size() - 1);
        return SimulateResultDTO.builder()
                .itemId(lastItem.getId())
                .name(lastItem.getName())
                .grade(lastItem.getGrade())
                .imageUrl(lastItem.getImageUrl())
                .build();
    }

    public List<SimulateResultDTO> simulateMultiple(Long boxId, int count) {
        return IntStream.range(0, count)
                .mapToObj(i -> simulate(boxId))
                .toList();
    }
}
