package org.exp.primeapp.service.interfaces;

import org.exp.primeapp.dto.request.UserReq;
import org.exp.primeapp.dto.request.UserUpdateReq;
import org.exp.primeapp.dto.responce.UserRes;
import org.exp.primeapp.models.entities.User;

import java.util.List;

public interface UserService {
    UserRes createUser(UserReq userReq);

    List<UserRes> getAllUsers();

    UserRes getByUserId(Long userId);

    UserRes updateUser(Long user_id, UserUpdateReq userReq);

    void updateUser_Active(Long userId);
}
