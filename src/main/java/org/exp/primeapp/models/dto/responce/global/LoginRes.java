package org.exp.primeapp.models.dto.responce.global;

import lombok.Value;

@Value
public class LoginRes {
    String accessToken;
    String refreshToken;
    String message;
}