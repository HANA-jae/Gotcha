package com.picklab.gotcha.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimulateResultDTO {
    private Long itemId;
    private String name;
    private String grade;
    private String imageUrl;
}
