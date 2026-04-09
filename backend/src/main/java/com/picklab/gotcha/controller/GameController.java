package com.picklab.gotcha.controller;

import com.picklab.gotcha.dto.GameDTO;
import com.picklab.gotcha.dto.GachaBoxDTO;
import com.picklab.gotcha.dto.GachaItemDTO;
import com.picklab.gotcha.dto.SimulateResultDTO;
import com.picklab.gotcha.service.GameService;
import com.picklab.gotcha.service.SimulateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
@Tag(name = "Game Management", description = "APIs for gacha game management")
public class GameController {

    private final GameService gameService;
    private final SimulateService simulateService;

    @GetMapping
    @Operation(summary = "Get all games", description = "Retrieve all active games")
    public ResponseEntity<List<GameDTO>> getAllGames() {
        return ResponseEntity.ok(gameService.getAllGames());
    }

    @GetMapping("/{gameId}")
    @Operation(summary = "Get game by ID", description = "Retrieve a game with all its boxes and items")
    public ResponseEntity<GameDTO> getGameById(@PathVariable Long gameId) {
        return ResponseEntity.ok(gameService.getGameById(gameId));
    }

    @PostMapping
    @Operation(summary = "Create game", description = "Create a new game")
    public ResponseEntity<GameDTO> createGame(@RequestBody GameDTO gameDTO) {
        GameDTO createdGame = gameService.createGame(gameDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGame);
    }

    // Box endpoints
    @GetMapping("/{gameId}/boxes")
    @Operation(summary = "Get boxes for game", description = "Retrieve all boxes for a specific game")
    public ResponseEntity<List<GachaBoxDTO>> getBoxesByGame(@PathVariable Long gameId) {
        return ResponseEntity.ok(gameService.getBoxesByGameId(gameId));
    }

    @PostMapping("/{gameId}/boxes")
    @Operation(summary = "Create box", description = "Create a new gacha box for a game")
    public ResponseEntity<GachaBoxDTO> createBox(@PathVariable Long gameId, @RequestBody GachaBoxDTO boxDTO) {
        GachaBoxDTO createdBox = gameService.createBox(gameId, boxDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBox);
    }

    @DeleteMapping("/boxes/{boxId}")
    @Operation(summary = "Delete box", description = "Delete a gacha box")
    public ResponseEntity<Void> deleteBox(@PathVariable Long boxId) {
        gameService.deleteBox(boxId);
        return ResponseEntity.noContent().build();
    }

    // Item endpoints
    @GetMapping("/boxes/{boxId}/items")
    @Operation(summary = "Get items for box", description = "Retrieve all items in a gacha box")
    public ResponseEntity<List<GachaItemDTO>> getItemsByBox(@PathVariable Long boxId) {
        return ResponseEntity.ok(gameService.getItemsByBoxId(boxId));
    }

    @PostMapping("/boxes/{boxId}/items")
    @Operation(summary = "Create item", description = "Create a new item in a gacha box")
    public ResponseEntity<GachaItemDTO> createItem(@PathVariable Long boxId, @RequestBody GachaItemDTO itemDTO) {
        GachaItemDTO createdItem = gameService.createItem(boxId, itemDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdItem);
    }

    @PutMapping("/items/{itemId}")
    @Operation(summary = "Update item", description = "Update an existing gacha item")
    public ResponseEntity<GachaItemDTO> updateItem(@PathVariable Long itemId, @RequestBody GachaItemDTO itemDTO) {
        GachaItemDTO updatedItem = gameService.updateItem(itemId, itemDTO);
        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Delete item", description = "Delete a gacha item")
    public ResponseEntity<Void> deleteItem(@PathVariable Long itemId) {
        gameService.deleteItem(itemId);
        return ResponseEntity.noContent().build();
    }

    // Simulation endpoints
    @PostMapping("/boxes/{boxId}/simulate")
    @Operation(summary = "Simulate gacha draw", description = "Simulate a single gacha draw")
    public ResponseEntity<SimulateResultDTO> simulate(@PathVariable Long boxId) {
        SimulateResultDTO result = simulateService.simulate(boxId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/boxes/{boxId}/simulate-multiple")
    @Operation(summary = "Simulate multiple draws", description = "Simulate multiple gacha draws")
    public ResponseEntity<List<SimulateResultDTO>> simulateMultiple(
            @PathVariable Long boxId,
            @RequestParam(defaultValue = "1") int count) {
        if (count < 1 || count > 1000) {
            return ResponseEntity.badRequest().build();
        }
        List<SimulateResultDTO> results = simulateService.simulateMultiple(boxId, count);
        return ResponseEntity.ok(results);
    }
}
