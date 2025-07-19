package org.exp.primeapp.botauth.service.impls;

import com.pengrad.telegrambot.TelegramBot;
import com.pengrad.telegrambot.model.request.ParseMode;
import com.pengrad.telegrambot.model.request.ReplyKeyboardRemove;
import com.pengrad.telegrambot.request.SendMessage;
import com.pengrad.telegrambot.response.SendResponse;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.botauth.service.interfaces.ButtonService;
import org.exp.primeapp.botauth.service.interfaces.MessageService;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final TelegramBot telegramBot;
    private final ButtonService buttonService;
    private final UserServiceImpl botAuthUserService;
    private final UserRepository userRepository;

    @Override
    public void sendStartMsg(Long chatId, String firstName) {
        SendResponse execute = telegramBot.execute(new SendMessage(chatId,
                """
                        🇺🇿
                        Salom """ + firstName + "👋\n" +
                        """ 
                                @prime77uz'ning rasmiy botiga xush kelibsiz
                                
                                ⬇ Kontaktingizni yuboring (tugmani bosib)
                                """
        )
                .parseMode(ParseMode.HTML)
                        .replyMarkup(buttonService.sendShareContactBtn())
        );
    }

    @Override
    public void sendLoginMsg(Long chatId) {
        telegramBot.execute(new SendMessage(chatId, """
                🇺🇿
                🔑 Yangi kod olish uchun /login ni bosing""")
                .parseMode(ParseMode.Markdown)
        );
    }

    @Override
    public void removeKeyboardAndSendCode(User user) {
        Integer oneTimeCode = botAuthUserService.generateOneTimeCode();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(2);
        telegramBot.execute(new SendMessage(user.getTelegramId(),
                "🔒 Code:\n<pre>" + oneTimeCode + "</pre>"
        )
                .parseMode(ParseMode.HTML)
                .replyMarkup(new ReplyKeyboardRemove())
        );
        userRepository.updateVerifyCodeAndExpiration(user.getId(), oneTimeCode, expirationTime);
        sendLoginMsg(user.getTelegramId());
    }

    public void sendCode(User user) {
        Integer oneTimeCode = botAuthUserService.generateOneTimeCode();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(2);
        telegramBot.execute(new SendMessage(user.getTelegramId(),
                        "🔒 Code:" + oneTimeCode + "\n\uD83D\uDD17 Click and Login:"
                )
                        .parseMode(ParseMode.HTML)
                        .replyMarkup(buttonService.sendRenewCodeBtn())
        );
        userRepository.updateVerifyCodeAndExpiration(user.getId(), oneTimeCode, expirationTime);
        sendLoginMsg(user.getTelegramId());
    }
}
