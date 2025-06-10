package org.exp.primeapp.dto.request;

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