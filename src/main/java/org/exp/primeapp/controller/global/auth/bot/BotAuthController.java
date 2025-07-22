package org.exp.primeapp.controller.global.auth.bot;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.exp.primeapp.models.dto.responce.global.LoginRes;
import org.exp.primeapp.models.dto.responce.user.UserRes;
import org.exp.primeapp.service.interfaces.global.auth.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.exp.primeapp.utils.Const.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(API + V1 + AUTH + CODE)
public class BotAuthController {

    private final AuthService authService;

    @PostMapping("/{code}")
    public ResponseEntity<LoginRes> verifyUserWithCode(@PathVariable Integer code) {
        LoginRes loginRes = authService.verifyWithCodeAndSendUserData(code);
        return new ResponseEntity<>(loginRes, HttpStatus.OK);
    }
}
