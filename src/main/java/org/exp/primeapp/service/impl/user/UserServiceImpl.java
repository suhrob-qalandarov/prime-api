package org.exp.primeapp.service.impl.user;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.admin.AdminUserDashboardRes;
import org.exp.primeapp.models.dto.responce.admin.AdminUserRes;
import org.exp.primeapp.models.dto.responce.user.UserRes;
import org.exp.primeapp.models.entities.Role;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.repository.UserRepository;
import org.exp.primeapp.service.interfaces.user.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserRes getUserData(User user) {
        return getByTelegramId(user.getTelegramId());
    }

    @Override
    public UserRes getByTelegramId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return convertToUserRes(user);
    }

    @Transactional
    @Override
    public AdminUserDashboardRes getAdminAllUsers() {
        List<AdminUserRes> adminUserResList = userRepository.findAll().stream().map(this::convertToAdminUserRes).toList();
        List<AdminUserRes> adminActiveUserResList = userRepository.findAllByActive(true).stream().map(this::convertToAdminUserRes).toList();
        List<AdminUserRes> adminInactiveUserResList = userRepository.findAllByActive(false).stream().map(this::convertToAdminUserRes).toList();

        long count = adminUserResList.size();
        long activeCount = adminActiveUserResList.size();
        long inactiveCount = adminInactiveUserResList.size();

        return new AdminUserDashboardRes(count, activeCount, inactiveCount, adminUserResList, adminActiveUserResList, adminInactiveUserResList);
    }

    @Override
    public UserRes getByUsername(String tgUsername) {
        User user = userRepository.findByTgUsername(tgUsername);
        return UserRes.builder()
                .telegramId(user.getTelegramId())
                .firstName(user.getFirstName())
                .phone(user.getPhone())
                .build();
    }

    @Override
    public void toggleUserUpdate(Long userId) {

    }

    @Override
    public UserRes getByPhoneNumber(String phoneNumber) {
        User user = userRepository.findByPhone(phoneNumber);
        return UserRes.builder()
                .telegramId(user.getTelegramId())
                .firstName(user.getFirstName())
                .phone(user.getPhone())
                .build();
    }

    @Override
    public UserRes getUserDataFromToken(User user) {
        return convertToUserRes(user);
    }

    @Override
    public UserRes getById(Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        return optionalUser.map(this::convertToUserRes).orElse(null);
    }

    private UserRes convertToUserRes(User user) {
        return new UserRes(
                user.getId(),
                user.getTelegramId(),
                user.getFirstName(),
                user.getLastName(),
                user.getRoles().stream().map(Role::getName).toList()
        );
    }

    private AdminUserRes convertToAdminUserRes(User user) {
        return new AdminUserRes(
                user.getTelegramId(),
                user.getFirstName(),
                user.getLastName(),
                user.getTgUsername(),
                user.getPhone(),
                user.getRoles().stream().map(Role::getName).toList(),
                user.getActive(),
                user.getCreatedAt()
        );
    }
}