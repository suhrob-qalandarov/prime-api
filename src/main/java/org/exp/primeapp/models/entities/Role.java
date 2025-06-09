package org.exp.primeapp.models.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import org.exp.primeapp.models.base.BaseEntity;
import org.springframework.security.core.GrantedAuthority;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "roles")
public class Role extends BaseEntity implements GrantedAuthority {
    private String name;

    @Override
    public String getAuthority() {
        return name;
    }
}
