package org.exp.primeapp.models.base;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.exp.primeapp.models.entities.Product;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass
public class Inventory extends BaseEntity {
    private Integer amount;

    @ManyToOne
    private Product product;
}
