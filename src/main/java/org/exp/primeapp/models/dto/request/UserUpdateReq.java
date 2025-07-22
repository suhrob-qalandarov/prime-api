package org.exp.primeapp.models.dto.request;

import lombok.Value;

import java.util.List;

@Value
public class UserUpdateReq {
    String firstName;
    String lastName;
    String username;
    String phone;
    Boolean _active;
    List<Long> role_ids;
}
