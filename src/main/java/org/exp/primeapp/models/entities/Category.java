package org.exp.primeapp.models.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.exp.primeapp.models.base.BaseEntity;
import org.springframework.data.annotation.Transient;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Category extends BaseEntity {

    private String name;

    private Integer order;

    @ManyToOne
    @JoinColumn(name = "spotlight_id")
    private Spotlight spotlight;

    @Transient
    private String spotlightName;
}
