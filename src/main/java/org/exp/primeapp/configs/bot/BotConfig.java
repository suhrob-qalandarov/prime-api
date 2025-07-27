
package org.exp.primeapp.configs;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.telegram.ProductAdminBot;
import org.springframework.context.annotation.Configuration;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

@Configuration
@RequiredArgsConstructor
public class BotConfig {

    private final ProductAdminBot productAdminBot;

    @PostConstruct
    public void registerBot() {
        TelegramBotsApi botsApi;
        try {
            botsApi = new TelegramBotsApi(DefaultBotSession.class);
            botsApi.registerBot(productAdminBot);
            System.out.println("✅ Bot muvaffaqiyatli ishga tushdi!");
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }
}

