package org.exp.primeapp.models.dto.request;

import lombok.Value;

import java.util.List;

@Value
public class UserUpdateReq {
    String firstName;
    String lastName;
    String email;
    String phone;

    //    description = "Optional: Used only by admin when creating or updating users"
    Boolean _active;


    //    description = "Optional: Used only by admin when creating or updating users"
    List<Long> role_ids;
}
