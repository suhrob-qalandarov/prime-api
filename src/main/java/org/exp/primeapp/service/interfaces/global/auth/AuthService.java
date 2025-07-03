package org.exp.primeapp.service.interfaces.global.auth;


import org.exp.primeapp.models.dto.request.LoginReq;
import org.exp.primeapp.models.dto.request.RegisterReq;
import org.exp.primeapp.models.dto.request.VerifyEmailReq;
import org.exp.primeapp.models.dto.responce.global.ApiResponse;
import org.exp.primeapp.models.dto.responce.global.LoginRes;

public interface AuthService {
    LoginRes login(LoginReq loginReq);

//    User register(RegisterReq registerDTO);

    ApiResponse sendVerificationCode(RegisterReq registerDTO);
    ApiResponse verifyCodeAndRegister(VerifyEmailReq req);
}
