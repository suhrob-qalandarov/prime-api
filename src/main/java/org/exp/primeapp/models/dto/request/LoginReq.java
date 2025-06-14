package org.exp.primeapp.models.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Value;

@Data
@AllArgsConstructor
@Value
public class LoginReq {
    String email;
    String password;
}