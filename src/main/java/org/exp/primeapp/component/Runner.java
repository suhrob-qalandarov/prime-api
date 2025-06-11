package org.exp.primeapp.component;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.entities.Role;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.models.repo.RoleRepository;
import org.exp.primeapp.models.repo.UserRepository;
import org.exp.primeapp.utils.Const;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@Component
@RequiredArgsConstructor
public class Runner implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        ArrayList<Role> roles = new ArrayList<>(List.of(
                new Role(ROLE_MEGA_SUPER_ADMIN),
                new Role(ROLE_SUPER_ADMIN),
                new Role(ROLE_ADMIN),
                new Role(ROLE_USER)
        ));

        if (roleRepository.findAll().isEmpty()) {
            roleRepository.saveAll(roles);
        }

        if (userRepository.count() == 0) {
            userRepository.save(
                    User.builder()
                            .firstName(ROLE_MEGA_SUPER_ADMIN)
                            .email("admin@gmail.com")
                            .password(passwordEncoder.encode("123"))
                            .phone("901234567")
                            ._active(true)
                            .build()
            );
        }
    }
}
