package org.exp.primeapp.botauth.service.impls;

import com.pengrad.telegrambot.model.request.*;
import org.exp.primeapp.botauth.service.interfaces.ButtonService;
import org.springframework.stereotype.Service;

@Service
public class ButtonServiceImpl implements ButtonService {

    @Override
    public Keyboard sendShareContactBtn() {
        return new ReplyKeyboardMarkup(
                new KeyboardButton("Kontaktni ulashish").requestContact(true)
        ).resizeKeyboard(true);
    }

    @Override
    public InlineKeyboardMarkup sendRenewCodeBtn() {
        return new InlineKeyboardMarkup(new InlineKeyboardButton("🔄Yangilash").callbackData("renew_code"));
    }
}
