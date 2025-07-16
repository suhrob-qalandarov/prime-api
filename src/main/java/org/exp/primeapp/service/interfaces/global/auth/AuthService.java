package org.exp.primeapp.service.interfaces.global.auth;


import jakarta.servlet.http.HttpServletResponse;
import org.exp.primeapp.models.dto.request.LoginReq;
import org.exp.primeapp.models.dto.request.RegisterReq;
import org.exp.primeapp.models.dto.request.VerifyEmailReq;
import org.exp.primeapp.models.dto.responce.global.ApiResponse;
import org.exp.primeapp.models.dto.responce.user.UserRes;

public interface AuthService {
    UserRes login(LoginReq loginReq, HttpServletResponse response);

//    User register(RegisterReq registerDTO);

    ApiResponse sendVerificationCode(RegisterReq registerDTO);
    ApiResponse verifyCodeAndRegister(VerifyEmailReq req);
}
