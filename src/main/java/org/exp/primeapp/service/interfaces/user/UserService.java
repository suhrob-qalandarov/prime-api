package org.exp.primeapp.service.interfaces.user;

import org.exp.primeapp.models.dto.request.UserReq;
import org.exp.primeapp.models.dto.request.UserUpdateReq;
import org.exp.primeapp.models.dto.responce.admin.AdminUserDashboardRes;
import org.exp.primeapp.models.dto.responce.global.ApiResponse;
import org.exp.primeapp.models.dto.responce.user.UserRes;
import org.exp.primeapp.models.entities.User;

import java.util.List;

public interface UserService {
    UserRes createUser(UserReq userReq);

    List<UserRes> getAllUsers();

    UserRes getByUserId(Long userId);

    UserRes updateUser(Long user_id, UserUpdateReq userReq);

    void updateUser_Active(Long userId);

    UserRes getByEmail(String email);

    AdminUserDashboardRes getAdminAllUsers();

    void toogleUserUpdate(Long userId);
}
