package org.exp.primeapp.models.dto.responce.admin;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class AdminProductRes {
    Long id;
    String name;
    Integer discount;
    Boolean active;
    String status;
    String categoryName;
    Integer attachmentCount;
    String collectionName;
    Integer sizeCount;
}
