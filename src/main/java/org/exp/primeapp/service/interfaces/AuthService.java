package org.exp.primeapp.service.interfaces;


import org.exp.primeapp.dto.LoginDTO;
import org.exp.primeapp.dto.RegisterDTO;
import org.exp.primeapp.dto.responce.LoginRes;

public interface AuthService {
    LoginRes login(LoginDTO loginDTO);

    void register(RegisterDTO registerDTO);
}
