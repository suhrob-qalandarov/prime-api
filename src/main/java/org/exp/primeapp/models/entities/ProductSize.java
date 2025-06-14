package org.exp.primeapp.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.exp.primeapp.models.base.BaseEntity;
import org.exp.primeapp.models.enums.Size;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ProductSize extends BaseEntity {

    @Enumerated(EnumType.STRING)
    private Size sizes;

    private Integer amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
}
