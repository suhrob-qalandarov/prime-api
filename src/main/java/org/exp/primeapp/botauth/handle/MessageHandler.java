package org.exp.primeapp.botauth.handle;

import com.pengrad.telegrambot.model.Contact;
import com.pengrad.telegrambot.model.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.botauth.service.interfaces.MessageService;
import org.exp.primeapp.botauth.service.interfaces.UserService;
import org.exp.primeapp.models.entities.User;
import org.springframework.stereotype.Component;

import java.util.function.Consumer;

@Slf4j
@Component
@RequiredArgsConstructor
public class MessageHandler implements Consumer<Message> {

    private final MessageService messageService;
    private final UserService userService;

    @Override
    public void accept(Message message) {
        String text = message.text();
        User user = userService.getOrCreateUser(message.from());

        if (message.contact() != null) {
            Contact contact = message.contact();
            messageService.removeKeyboardAndSendMsg(user.getTelegramId());
            messageService.sendCode(user);
            userService.updateUserPhoneById(user.getId(), contact.phoneNumber());

        } else if (text.equals("/start")) {
            messageService.sendStartMsg(user.getTelegramId(), user.getFirstName());

        } else if (text.equals("/login")) {
            userService.updateOneTimeCode(user.getId());
            messageService.sendLoginMsg(user.getTelegramId());

        }


    }
}
