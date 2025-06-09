package org.exp.primeapp.models.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.exp.primeapp.models.base.BaseEntity;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Product extends BaseEntity {
    String name;
    Double price;
    Integer amount;
    @ManyToOne
    private Category category;

    @ManyToOne
    private Attachment attachment;
}
