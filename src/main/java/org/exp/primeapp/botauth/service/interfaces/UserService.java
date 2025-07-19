package org.exp.primeapp.botauth.service.interfaces;

import com.pengrad.telegrambot.model.Message;
import org.exp.primeapp.models.entities.User;
import org.springframework.stereotype.Service;

@Service
public interface UserService {

    User getOrCreateUser(Message message);

    void updateTgUser(Long tgUserId, User user);

    Integer generateOneTimeCode();

    void updateOneTimeCode(Long userId);

    void updateUserPhoneById(Long userId, String phoneNumber);
}
