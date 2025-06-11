package org.exp.primeapp.service.interfaces;

public interface EmailService {
    void sendVerificationEmail(String toEmail, String code);
}
