package org.exp.primeapp.dto.request;

import lombok.Value;

@Value
public class VerifyEmailReq {
    String email;
    String code;
}
