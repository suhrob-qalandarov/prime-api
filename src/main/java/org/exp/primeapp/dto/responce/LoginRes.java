package org.exp.primeapp.dto.responce;

import lombok.Value;

@Value
public class LoginRes {
    String token;
    String refreshToken;
    String message;
}