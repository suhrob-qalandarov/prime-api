package org.exp.primeapp.botauth.service.interfaces;

import org.exp.primeapp.models.entities.User;
import org.springframework.stereotype.Service;

@Service
public interface UserService {

    User getOrCreateUser(com.pengrad.telegrambot.model.User tgUser);

    void updateTgUser(Long tgUserId, User user);

    Integer generateOneTimeCode();

    void updateOneTimeCode(Long userId);

    void updateUserPhoneById(Long userId, String phoneNumber);
}
