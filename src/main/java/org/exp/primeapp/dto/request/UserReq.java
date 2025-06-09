package org.exp.primeapp.dto.request;

import lombok.Value;

import java.util.List;

@Value
public class UserReq {
    String firstName;
    String lastName;
    String email;
    String password;
    String confirmPassword;
    String phone;

//    description = "Optional: Used only by admin when creating or updating users"
    Boolean _active;


//    description = "Optional: Used only by admin when creating or updating users"
    List<Long> role_ids;
}
