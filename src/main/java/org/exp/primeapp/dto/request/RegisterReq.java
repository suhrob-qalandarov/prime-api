package org.exp.primeapp.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Value;

@Data
@AllArgsConstructor
@Value
public class RegisterReq {
    String email;
    String password;
    String confirmPassword;
    String firstName;
    String lastName;
    String phone;
}
