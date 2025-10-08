package org.exp.primeapp.models.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.exp.primeapp.models.base.BaseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User extends BaseEntity implements UserDetails {

    private Long telegramId;
    private String firstName;
    private String lastName;
    private String tgUsername;
    private String phone;

    private Integer messageId;
    private Integer verifyCode;

    private LocalDateTime verifyCodeExpiration;

    @ManyToMany(fetch = FetchType.EAGER)
    private List<Role> roles;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles;
    }

    @Override
    public String getUsername() {
        return this.phone;
    }

    @Override
    public String getPassword() {
        return "[PROTECTED]";
    }

    /*@Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(getActive());
    }*/
}


