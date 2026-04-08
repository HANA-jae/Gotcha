package com.picklab.gotcha.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GachaItemDTO {
    private Long id;
    private Long boxId;
    private String name;
    private String grade;
    private BigDecimal probability;
    private String imageUrl;
}
