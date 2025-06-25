package org.exp.primeapp.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.exp.primeapp.models.base.BaseEntity;
import org.exp.primeapp.models.enums.ProductStatus;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Product extends BaseEntity {
    private String name;
    private String description;
    private Double price;
    private Integer discount;

    @Enumerated(EnumType.STRING)
    @Column
    private ProductStatus status = ProductStatus.NEW;

    @ManyToOne
    private Category category;

    @OneToOne
    private Attachment mainImage;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinTable(
            name = "product_attachment",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "attachment_id")
    )
    private List<Attachment> attachments = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductSize> sizes = new ArrayList<>();

    @ManyToOne
    @JoinTable(
            name = "collections_products",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "collection_id")
    )
    private Collection collection;

    public void addSize(ProductSize productSize) {
        if (sizes.stream().noneMatch(ps -> ps.getSize() == productSize.getSize())) {
            productSize.setProduct(this);
            sizes.add(productSize);
        } else {
            throw new IllegalArgumentException("Product already has a size: " + productSize.getSize());
        }
    }
}