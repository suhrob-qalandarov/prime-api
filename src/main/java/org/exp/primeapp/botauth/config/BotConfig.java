package org.exp.primeapp.botauth.config;

import com.pengrad.telegrambot.TelegramBot;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
public class BotConfig {

    @Value("${telegram.bot.token}")
    private String botToken;

    @Bean
    public TelegramBot telegramBot() {
        return new TelegramBot(botToken);
    }

    @Bean
    public ExecutorService executorService() {
        return Executors.newFixedThreadPool(30);
    }
}
