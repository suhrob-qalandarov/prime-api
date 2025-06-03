package org.exp.primeapp.service.interfaces;


import org.exp.primeapp.dto.request.LoginReq;
import org.exp.primeapp.dto.request.RegisterReq;
import org.exp.primeapp.dto.responce.LoginRes;

public interface AuthService {
    LoginRes login(LoginReq loginReq);

    void register(RegisterReq registerDTO);
}
