package org.exp.primeapp.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
    private String username;
    private String email;
    private String password;
    private String phone;

    private Integer verifyCode;
    @Column(name = "verify_code_expiration")
    private LocalDateTime verifyCodeExpiration;

    @ManyToMany(fetch = FetchType.EAGER)
    private List<Role> roles;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    public User(String email, List<Role> roles) {
        this.email = email;
        this.roles = roles;
    }

    @Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(getActive());
    }
}


