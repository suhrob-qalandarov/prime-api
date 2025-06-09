package org.exp.primeapp.service.interfaces;

import org.exp.primeapp.dto.request.UserReq;
import org.exp.primeapp.dto.request.UserUpdateReq;
import org.exp.primeapp.models.entities.User;

import java.util.List;

public interface UserService {
    User createUser(UserReq userReq);

    List<User> getAllUsers();

    User getByUserId(Long userId);

    User updateUser(Long user_id, UserUpdateReq userReq);

    void updateUser_Active(Long userId);
}
