package org.exp.primeapp.botauth.handle;

import com.pengrad.telegrambot.TelegramBot;
import com.pengrad.telegrambot.model.CallbackQuery;
import com.pengrad.telegrambot.request.AnswerCallbackQuery;
import com.pengrad.telegrambot.request.EditMessageText;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.botauth.service.interfaces.MessageService;
import org.exp.primeapp.models.entities.User;
import org.springframework.stereotype.Component;

import org.exp.primeapp.botauth.service.interfaces.UserService;

import java.time.LocalDateTime;
import java.util.function.Consumer;

@Slf4j
@Component
@RequiredArgsConstructor
public class CallbackHandler implements Consumer<CallbackQuery> {

    private final UserService userService;
    private final MessageService messageService;
    private final TelegramBot telegramBot;

    @Override
    public void accept(CallbackQuery callbackQuery) {
        String data = callbackQuery.data();
        String callbackId = callbackQuery.id();
        Long fromId = callbackQuery.from().id();
        User user = userService.getOrCreateUser(callbackQuery.from());

        if (data.equals("renew_code")) {
            if (user.getVerifyCodeExpiration().isAfter(LocalDateTime.now())) {
                telegramBot.execute(new AnswerCallbackQuery(callbackId)
                        .text("Eski kodingiz hali ham kuchda ☝️")
                        .showAlert(true));
                return;
            }

            messageService.renewCode(user);

            /*telegramBot.execute(new EditMessageText(
                    fromId,
                    callbackQuery.message().messageId(),
                    "")
            );*/
        }
    }
}
