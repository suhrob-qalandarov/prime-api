package org.exp.primeapp.botauth.service.impls;

import com.pengrad.telegrambot.TelegramBot;
import com.pengrad.telegrambot.model.request.ParseMode;
import com.pengrad.telegrambot.model.request.ReplyKeyboardRemove;
import com.pengrad.telegrambot.request.EditMessageText;
import com.pengrad.telegrambot.request.SendMessage;
import com.pengrad.telegrambot.response.SendResponse;
import jakarta.transaction.Transactional;
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
                "🔒 Kod:\n<pre>" + oneTimeCode + "</pre>"
        )
                .parseMode(ParseMode.HTML)
                .replyMarkup(new ReplyKeyboardRemove())
        );
        userRepository.updateVerifyCodeAndExpiration(user.getTelegramId(), oneTimeCode, expirationTime);
        //sendLoginMsg(user.getTelegramId());
    }

    @Override
    public void removeKeyboardAndSendMsg(Long chatId) {
        telegramBot.execute(new SendMessage(chatId, "🔑Muvaffaqiyatli ro'yhatdan o'tkazildi!")
                .parseMode(ParseMode.Markdown)
                .replyMarkup(new ReplyKeyboardRemove())
        );
    }

    @Transactional
    public void sendCode(User user) {
        Integer oneTimeCode = botAuthUserService.generateOneTimeCode();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(5);
        SendResponse response = telegramBot.execute(new SendMessage(user.getTelegramId(),
                        "🔒 Kod: <pre>" + oneTimeCode + "</pre>" + "\n\n\uD83D\uDD17 Bosing va Kiring: \nprime/login"
                )
                        .parseMode(ParseMode.HTML)
                        .replyMarkup(buttonService.sendRenewCodeBtn())
        );
        userRepository.updateVerifyCodeAndExpiration(user.getTelegramId(), oneTimeCode, expirationTime);
        userRepository.updateMessageId(user.getTelegramId(), response.message().messageId());
        //sendLoginMsg(user.getTelegramId());
    }

    @Transactional
    public void renewCode(User user) {
        Integer oneTimeCode = botAuthUserService.generateOneTimeCode();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(5);

        SendResponse response = (SendResponse) telegramBot.execute(new EditMessageText(
                user.getTelegramId(),
                user.getMessageId(),
                "🔒 Kod: \n<pre>" + oneTimeCode + "</pre>" + "\n\n\uD83D\uDD17 Bosing va Kiring: \nprime/login"
                ).parseMode(ParseMode.HTML)
                .replyMarkup(buttonService.sendRenewCodeBtn())
        );
        userRepository.updateVerifyCodeAndExpiration(user.getTelegramId(), oneTimeCode, expirationTime);
        userRepository.updateMessageId(user.getTelegramId(), response.message().messageId());
    }
}
