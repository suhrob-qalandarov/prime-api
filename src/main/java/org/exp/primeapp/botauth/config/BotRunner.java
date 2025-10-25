package org.exp.primeapp.botauth.config;

import com.pengrad.telegrambot.TelegramBot;
import com.pengrad.telegrambot.UpdatesListener;
import com.pengrad.telegrambot.model.Update;
import com.pengrad.telegrambot.request.DeleteWebhook;
import com.pengrad.telegrambot.response.BaseResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.botauth.handle.CallbackHandler;
import org.exp.primeapp.botauth.handle.MessageHandler;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.concurrent.ExecutorService;

@Slf4j
@Component
@RequiredArgsConstructor
public class BotRunner implements CommandLineRunner {

    private final TelegramBot bot;
    private final ExecutorService executorService;
    private final MessageHandler messageHandler;
    private final CallbackHandler callbackHandler;

    @PostConstruct
    public void deleteWebhookIfExists() {
        if (bot == null) {
            log.warn("⚠️ Telegram bot is disabled. Skipping webhook deletion.");
            return;
        }

        BaseResponse response = bot.execute(new DeleteWebhook());
        if (response.isOk()) log.info("✅ Webhook deleted successfully.");
        else log.error("❌ Failed to delete webhook: {}", response.description());
    }

    @Override
    public void run(String... args) {
        if (bot == null) {
            log.warn("⚠️ Telegram bot is disabled. Skipping bot listener startup.");
            return;
        }

        bot.setUpdatesListener(updates -> {
            for (Update update : updates) {
                executorService.execute(() -> {
                    if (update.message() != null) messageHandler.accept(update.message());
                    else if (update.callbackQuery() != null) callbackHandler.accept(update.callbackQuery());
                    else log.warn("Unknown update: {}", update);
                });
            }
            return UpdatesListener.CONFIRMED_UPDATES_ALL;
        });

        log.info("🤖 Telegram bot listener started successfully!");
    }
}
