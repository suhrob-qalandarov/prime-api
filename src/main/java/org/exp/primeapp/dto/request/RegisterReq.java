package org.exp.primeapp.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Value;

@Data
@AllArgsConstructor
@Value
public class RegisterReq {
     String firstName;
     String lastName;
     String email;
     String phone;
     String password;
     String confirmPassword;
}

