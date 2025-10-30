package org.exp.primeapp.models.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.exp.primeapp.models.base.BaseEntity;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Category extends BaseEntity {

    @Column(nullable = false)
    private String name;

    private Long orderNumber;

    @Builder.Default
    private String spotlightName = null;
}
