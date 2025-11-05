package org.exp.primeapp.models.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.exp.primeapp.models.base.BaseEntity;
import org.exp.primeapp.models.enums.CategoryStatus;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Category extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Long orderNumber;

    @Builder.Default
    private String spotlightName = null;

    @Builder.Default
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CategoryStatus status = CategoryStatus.CREATED;
}
