package org.exp.primeapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDTO {
    private String email;
    private String password;
    private String confirmPassword;
    private String firstName;
    private String lastName;
    private String phone;
}
