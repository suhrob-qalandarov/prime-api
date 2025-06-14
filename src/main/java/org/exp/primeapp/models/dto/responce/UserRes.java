package org.exp.primeapp.models.dto.responce;

import lombok.Value;

@Value
public class UserRes {
    String firstName;
    String lastName;
    String email;
    String phone;
}
