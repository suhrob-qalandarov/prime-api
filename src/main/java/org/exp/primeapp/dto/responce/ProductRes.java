package org.exp.primeapp.dto.responce;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductRes {
    String name;
    String description;
    Double price;
    Integer amount;
    Long categoryId;
}
