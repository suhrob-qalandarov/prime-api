package org.exp.primeapp.component;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.entities.Role;
import org.exp.primeapp.models.repo.RoleRepository;
import org.exp.primeapp.utils.Const;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@Component
@RequiredArgsConstructor
public class Runner implements CommandLineRunner {
    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.findAll().isEmpty()) {
            roleRepository.saveAll(new ArrayList<>(List.of(
                    new Role(ROLE_MEGA_SUPER_ADMIN),
                    new Role(ROLE_SUPER_ADMIN),
                    new Role(ROLE_ADMIN),
                    new Role(ROLE_USER)
            )));
        }
    }
}
