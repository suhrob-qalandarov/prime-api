package org.exp.primeapp.service.impl;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.dto.request.UserReq;
import org.exp.primeapp.dto.request.UserUpdateReq;
import org.exp.primeapp.models.entities.Role;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.models.repo.RoleRepository;
import org.exp.primeapp.models.repo.UserRepository;
import org.exp.primeapp.service.interfaces.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public User createUser(UserReq userReq) {
        if (!userReq.getPassword().equals(userReq.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and confirm password do not match");
        }


            User user = User.builder()
                    .firstName(userReq.getFirstName())
                    .lastName(userReq.getLastName())
                    .email(userReq.getEmail())
                    .password(userReq.getPassword())
                    .phone(userReq.getPhone())
                    .build();


        checkUserIs_ActiveAndRolesAndUse(userReq.get_active(), user, userReq.getRole_ids());


        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getByUserId(Long userId) {
        return userRepository.findById(userId).orElseThrow(RuntimeException::new);
    }

    @Transactional
    @Override
    public User updateUser(Long user_id, UserUpdateReq userReq) {
        User user = User.builder()
                .firstName(userReq.getFirstName())
                .lastName(userReq.getLastName())
                .email(userReq.getEmail())
                .phone(userReq.getPhone())
                .build();

        checkUserIs_ActiveAndRolesAndUse(userReq.get_active(), user, userReq.getRole_ids());

        return userRepository.save(user);
    }

    @Transactional
    @Override
    public void updateUser_Active(Long userId) {
        userRepository.findById(userId).ifPresent(user -> user.set_active(false));
    }

    private void checkUserIs_ActiveAndRolesAndUse(Boolean userReq, User user, List<Long> userReq1) {
        user.set_active(Objects.requireNonNullElse(userReq, true));

        if (userReq1 == null) {
            user.setRoles(new ArrayList<>(List.of(new Role("ROLE_USER"))));
        } else {
            List<Role> roles = roleRepository.findAllByIdIn(userReq1);
            user.setRoles(new ArrayList<>(roles));
        }
    }
}
