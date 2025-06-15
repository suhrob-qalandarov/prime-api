package org.exp.primeapp.models.base;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass
public class BaseEntity extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    private Boolean active = true;
}
