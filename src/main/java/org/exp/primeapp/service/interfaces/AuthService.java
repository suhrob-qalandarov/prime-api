package org.exp.primeapp.service.interfaces;


import org.exp.primeapp.dto.request.LoginReq;
import org.exp.primeapp.dto.request.RegisterReq;
import org.exp.primeapp.dto.request.VerifyEmailReq;
import org.exp.primeapp.dto.responce.ApiResponse;
import org.exp.primeapp.dto.responce.LoginRes;

public interface AuthService {
    LoginRes login(LoginReq loginReq);

//    User register(RegisterReq registerDTO);

    ApiResponse sendVerificationCode(RegisterReq registerDTO);
    ApiResponse verifyCodeAndRegister(VerifyEmailReq req);
}
