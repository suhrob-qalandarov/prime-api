package org.exp.primeapp.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.exp.primeapp.models.base.BaseEntity;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "spotlights")
public class Spotlight extends BaseEntity {

    private String name;
    private Long orderNumber;

    @OneToOne
    private Attachment image;

    @OneToMany(mappedBy = "spotlight", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Category> categories;
}