package org.exp.primeapp.models.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.exp.primeapp.models.base.BaseEntity;
import org.exp.primeapp.models.enums.ProductStatus;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Product extends BaseEntity {
    private String name;
    private String brand;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    private BigDecimal price;
    private BigDecimal costPrice;
    private Integer discount;

    @Enumerated(EnumType.STRING)
    @Column
    private ProductStatus status = ProductStatus.NEW;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Category category;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "products_attachments",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "attachment_id")
    )
    private List<Attachment> attachments = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductSize> sizes = new HashSet<>();

    public void addSize(ProductSize productSize) {
        ProductSize existing = sizes.stream()
                .filter(ps -> ps.getSize().equals(productSize.getSize()))
                .findFirst()
                .orElse(null);

        if (existing == null) {
            productSize.setProduct(this);
            sizes.add(productSize);
        } else {
            int newAmount = existing.getAmount() + productSize.getAmount();
            existing.setAmount(newAmount);
        }
    }
}