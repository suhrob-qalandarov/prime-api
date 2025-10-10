package org.exp.primeapp.service.interfaces.user;

import org.exp.primeapp.models.dto.responce.admin.AdminUserDashboardRes;
import org.exp.primeapp.models.dto.responce.user.UserRes;
import org.exp.primeapp.models.entities.User;

public interface UserService {

    UserRes getUserData(User user);

    UserRes getByTelegramId(Long userId);

    AdminUserDashboardRes getAdminAllUsers();

    UserRes getByUsername(String tgUsername);

    void toggleUserUpdate(Long userId);

    UserRes getByPhoneNumber(String phoneNumber);

    UserRes getUserDataFromToken(User user);

    UserRes getById(Long id);

    UserRes getAdminUserDataFromToken(User user);
}