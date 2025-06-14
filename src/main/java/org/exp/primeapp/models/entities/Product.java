package org.exp.primeapp.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.exp.primeapp.models.base.BaseEntity;
import org.exp.primeapp.models.enums.ProductStatus;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Product extends BaseEntity {
    private String name;
    private String description;
    private Double price;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductSize> sizes = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column
    private ProductStatus status = ProductStatus.NEW;

    @ManyToOne
    private Category category;

    @OneToMany
    @JoinTable(
            name = "product_attachment",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "attachment_id")
    )
    private List<Attachment> attachments = new ArrayList<>();

    public void addSize(ProductSize productSize) {
        if (this.sizes == null) {
            this.sizes = new ArrayList<>();
        }
        productSize.setProduct(this);
        sizes.add(productSize);
    }
}