package org.exp.primeapp.service.impl.user;

import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.request.UserReq;
import org.exp.primeapp.models.dto.request.UserUpdateReq;
import org.exp.primeapp.models.dto.responce.admin.AdminUserDashboardRes;
import org.exp.primeapp.models.dto.responce.admin.AdminUserRes;
import org.exp.primeapp.models.dto.responce.global.ApiResponse;
import org.exp.primeapp.models.dto.responce.user.UserRes;
import org.exp.primeapp.models.entities.Role;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.repository.RoleRepository;
import org.exp.primeapp.repository.UserRepository;
import org.exp.primeapp.service.interfaces.user.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserRes createUser(UserReq userReq) {
        if (!userReq.getPassword().equals(userReq.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and confirm password do not match");
        }

        User user = User.builder()
                .firstName(userReq.getFirstName())
                .lastName(userReq.getLastName())
                .email(userReq.getEmail())
                .password(passwordEncoder.encode(userReq.getPassword()))
                .phone(userReq.getPhone())
                .build();


        checkUserActiveAndRolesAndUse(userReq.get_active(), user, userReq.getRole_ids());


        User savedUser = userRepository.save(user);
        return new UserRes(
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getEmail(),
                savedUser.getPhone());
    }

    @Override
    public List<UserRes> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> new UserRes(
                        user.getId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getPhone()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public UserRes getByUserId(Long userId) {
        User foundUser = userRepository.findById(userId).orElseThrow(RuntimeException::new);
        return new UserRes(
                foundUser.getId(),
                foundUser.getFirstName(),
                foundUser.getLastName(),
                foundUser.getEmail(),
                foundUser.getPhone());
    }

    @Transactional
    @Override
    public ApiResponse updateUser(Long user_id, UserUpdateReq userReq) {
        User user = User.builder()
                .firstName(userReq.getFirstName())
                .lastName(userReq.getLastName())
                .email(userReq.getEmail())
                .phone(userReq.getPhone())
                .build();

        checkUserActiveAndRolesAndUse(userReq.get_active(), user, userReq.getRole_ids());

        userRepository.save(user);
        return new ApiResponse(true, "User updated successfully");

    }

    @Transactional
    @Override
    public void updateUser_Active(Long userId) {
        userRepository.findById(userId).ifPresent(user -> user.setActive(false));
    }

    @Override
    public UserRes getByEmail(String email) {
        User user = userRepository.findByEmail(email);
        return UserRes.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .build();
    }

    @Override
    public ApiResponse activateUser(Long userId) {
        int updated = userRepository.updateActive(true, userId);
        if (updated > 0) {
            return new ApiResponse(true, "Product activated successfully");
        } else {
            return new ApiResponse(false, "Product not found with id or already active");
        }
    }

    @Override
    public ApiResponse deactivateUser(Long userId) {
        int updated = userRepository.updateActive(false, userId);
        if (updated > 0) {
            return new ApiResponse(true, "Product activated successfully");
        } else {
            return new ApiResponse(false, "Product not found with id or already active");
        }
    }

    @Override
    public AdminUserDashboardRes getAdminAllUsers() {
        List<AdminUserRes> adminUserResList = userRepository.findAll().stream().map(this::convertToAdminUserRes).toList();
        List<AdminUserRes> adminActiveUserResList = userRepository.findAllByActive(true).stream().map(this::convertToAdminUserRes).toList();
        List<AdminUserRes> adminInactiveUserResList = userRepository.findAllByActive(false).stream().map(this::convertToAdminUserRes).toList();

        long count = userRepository.count();
        long activeCount = userRepository.countByActive(true);
        long inactiveCount = count - activeCount;


        return new AdminUserDashboardRes(count, activeCount, inactiveCount, adminUserResList, adminActiveUserResList, adminInactiveUserResList);
    }

    private AdminUserRes convertToAdminUserRes(User user) {
        return new AdminUserRes(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getActive(),
                user.getCreatedAt()
        );
    }

    private void checkUserActiveAndRolesAndUse(Boolean userReq, User user, List<Long> userReq1) {
        user.setActive(Objects.requireNonNullElse(userReq, true));

        if (userReq1 == null) {
            user.setRoles(new ArrayList<>(List.of(new Role("ROLE_USER"))));
        } else {
            List<Role> roles = roleRepository.findAllByIdIn(userReq1);
            user.setRoles(new ArrayList<>(roles));
        }
    }
}
