package org.exp.primeapp.models.dto.responce;

import lombok.Value;

@Value
public class LoginRes {
    String accessToken;
    String refreshToken;
    String message;
}