package org.exp.primeapp.models.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.exp.primeapp.models.base.Inventory;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ProductIncome extends Inventory {
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_user_id", nullable = false)
    private User userAdmin;
}
