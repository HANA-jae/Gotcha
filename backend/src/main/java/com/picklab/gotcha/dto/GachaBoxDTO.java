package com.picklab.gotcha.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GachaBoxDTO {
    private Long id;
    private Long gameId;
    private String name;
    private String description;
    private List<GachaItemDTO> items;
}
