package org.exp.primeapp.models.dto.request;

import lombok.Value;

@Value
public class VerifyEmailReq {
    String email;
    String code;
}
