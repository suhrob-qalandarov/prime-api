package org.exp.primeapp.botauth.config;

import com.pengrad.telegrambot.TelegramBot;
import com.pengrad.telegrambot.UpdatesListener;
import com.pengrad.telegrambot.model.Update;
import com.pengrad.telegrambot.request.DeleteWebhook;
import com.pengrad.telegrambot.response.BaseResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.botauth.handle.CallbackHandler;
import org.exp.primeapp.botauth.handle.MessageHandler;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.concurrent.ExecutorService;

@Component
@RequiredArgsConstructor
public class BotRunner implements CommandLineRunner {

    private final TelegramBot bot;
    private final ExecutorService executorService;
    private final MessageHandler messageHandler;
    private final CallbackHandler callbackHandler;

    @PostConstruct
    public void deleteWebhookIfExists() {
        BaseResponse response = bot.execute(new DeleteWebhook());
        if (response.isOk()) {
            System.out.println("✅ Webhook deleted successfully.");
        } else {
            System.out.println("❌ Failed to delete webhook: " + response.description());
        }
    }

    @Override
    public void run(String... args) throws Exception {
        bot.setUpdatesListener(updates -> {
            for (Update update : updates) {
                executorService.execute(() -> {
                    if (update.message() != null) {
                        messageHandler.accept(update.message());

                    } else if (update.callbackQuery() != null) {
                        callbackHandler.accept(update.callbackQuery());

                    } else System.err.println("Unknown message -> " + update);
                });
            }
            return UpdatesListener.CONFIRMED_UPDATES_ALL;
        });
    }
}
