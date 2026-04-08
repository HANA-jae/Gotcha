package com.picklab.gotcha.service;

import com.picklab.gotcha.dto.GameDTO;
import com.picklab.gotcha.dto.GachaBoxDTO;
import com.picklab.gotcha.dto.GachaItemDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class GameService {

    // ===== Hardcoded Data =====
    private static final List<GameDTO> GAMES;
    private static final Map<Long, List<GachaBoxDTO>> BOXES_BY_GAME;
    private static final Map<Long, List<GachaItemDTO>> ITEMS_BY_BOX;

    static {
        // Game: BATTLEGROUNDS (id=1)
        GameDTO battlegrounds = GameDTO.builder()
                .id(1L)
                .name("BATTLEGROUNDS")
                .slug("battlegrounds")
                .description("배틀그라운드 무기 스킨 및 의상 확률을 확인하세요")
                .imageUrl("/images/battlegrounds.jpg")
                .isActive(true)
                .build();

        GAMES = List.of(battlegrounds);

        // Box1: Weapon Skin Box (id=1, gameId=1)
        GachaBoxDTO weaponBox = GachaBoxDTO.builder()
                .id(1L)
                .gameId(1L)
                .name("무기 스킨 박스")
                .description("다양한 무기 스킨을 얻을 수 있습니다")
                .build();

        // Box2: Costume Box (id=2, gameId=1)
        GachaBoxDTO costumeBox = GachaBoxDTO.builder()
                .id(2L)
                .gameId(1L)
                .name("의상 박스")
                .description("캐릭터 의상 및 세트를 얻을 수 있습니다")
                .build();

        BOXES_BY_GAME = Map.of(1L, List.of(weaponBox, costumeBox));

        // Items for Box1 (Weapon Skins)
        List<GachaItemDTO> weaponItems = List.of(
                GachaItemDTO.builder()
                        .id(1L)
                        .boxId(1L)
                        .name("레전드 무기 스킨")
                        .grade("Legend")
                        .probability(new BigDecimal("0.5"))
                        .imageUrl("/images/items/legendary_weapon.jpg")
                        .build(),
                GachaItemDTO.builder()
                        .id(2L)
                        .boxId(1L)
                        .name("에픽 무기 스킨")
                        .grade("Epic")
                        .probability(new BigDecimal("2.0"))
                        .imageUrl("/images/items/epic_weapon.jpg")
                        .build(),
                GachaItemDTO.builder()
                        .id(3L)
                        .boxId(1L)
                        .name("희귀 무기 스킨")
                        .grade("Rare")
                        .probability(new BigDecimal("8.0"))
                        .imageUrl("/images/items/rare_weapon.jpg")
                        .build(),
                GachaItemDTO.builder()
                        .id(4L)
                        .boxId(1L)
                        .name("일반 무기 스킨")
                        .grade("Normal")
                        .probability(new BigDecimal("89.5"))
                        .imageUrl("/images/items/normal_weapon.jpg")
                        .build()
        );

        // Items for Box2 (Costumes)
        List<GachaItemDTO> costumeItems = List.of(
                GachaItemDTO.builder()
                        .id(5L)
                        .boxId(2L)
                        .name("프리미엄 의상")
                        .grade("Legend")
                        .probability(new BigDecimal("1.0"))
                        .imageUrl("/images/items/legendary_costume.jpg")
                        .build(),
                GachaItemDTO.builder()
                        .id(6L)
                        .boxId(2L)
                        .name("에픽 의상")
                        .grade("Epic")
                        .probability(new BigDecimal("3.0"))
                        .imageUrl("/images/items/epic_costume.jpg")
                        .build(),
                GachaItemDTO.builder()
                        .id(7L)
                        .boxId(2L)
                        .name("희귀 의상")
                        .grade("Rare")
                        .probability(new BigDecimal("12.0"))
                        .imageUrl("/images/items/rare_costume.jpg")
                        .build(),
                GachaItemDTO.builder()
                        .id(8L)
                        .boxId(2L)
                        .name("일반 의상")
                        .grade("Normal")
                        .probability(new BigDecimal("84.0"))
                        .imageUrl("/images/items/normal_costume.jpg")
                        .build()
        );

        ITEMS_BY_BOX = Map.of(1L, weaponItems, 2L, costumeItems);
    }

    // ===== Read Operations =====

    public List<GameDTO> getAllGames() {
        return GAMES;
    }

    public GameDTO getGameById(Long id) {
        return GAMES.stream()
                .filter(g -> g.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Game not found with id: " + id));
    }

    public List<GachaBoxDTO> getBoxesByGameId(Long gameId) {
        // Verify game exists
        getGameById(gameId);
        return BOXES_BY_GAME.getOrDefault(gameId, List.of());
    }

    public List<GachaItemDTO> getItemsByBoxId(Long boxId) {
        return ITEMS_BY_BOX.getOrDefault(boxId, List.of());
    }

    // ===== Stub Operations (no-op) =====

    public GameDTO createGame(GameDTO gameDTO) {
        return gameDTO;
    }

    public GachaBoxDTO createBox(Long gameId, GachaBoxDTO boxDTO) {
        return boxDTO;
    }

    public GachaItemDTO createItem(Long boxId, GachaItemDTO itemDTO) {
        return itemDTO;
    }

    public GachaItemDTO updateItem(Long itemId, GachaItemDTO itemDTO) {
        return itemDTO;
    }

    public void deleteItem(Long itemId) {
        // No-op
    }

    public void deleteBox(Long boxId) {
        // No-op
    }
}
