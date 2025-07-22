package org.exp.primeapp.service.interfaces.global.auth;


import org.exp.primeapp.models.dto.responce.global.LoginRes;

public interface AuthService {
    LoginRes verifyWithCodeAndSendUserData(Integer code);
}
