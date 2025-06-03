package org.exp.primeapp.service.interfaces;


import org.exp.primeapp.dto.request.LoginReq;
import org.exp.primeapp.dto.request.RegisterReq;
import org.exp.primeapp.dto.responce.LoginRes;
import org.exp.primeapp.models.entities.User;

public interface AuthService {
    LoginRes login(LoginReq loginReq);

    User register(RegisterReq registerDTO);
}
