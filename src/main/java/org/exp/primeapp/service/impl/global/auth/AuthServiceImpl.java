package org.exp.primeapp.service.impl.global.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.configs.security.JwtService;
import org.exp.primeapp.configs.security.MySecurityFilter;
import org.exp.primeapp.models.dto.responce.global.LoginRes;
import org.exp.primeapp.models.dto.responce.order.UserProfileOrdersRes;
import org.exp.primeapp.models.dto.responce.user.UserRes;
import org.exp.primeapp.models.entities.Role;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.repository.UserRepository;
import org.exp.primeapp.service.interfaces.global.auth.AuthService;
import org.exp.primeapp.service.interfaces.user.OrderService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final JwtService jwtService;
    private final MySecurityFilter mySecurityFilter;
    private final UserRepository userRepository;
    private final OrderService orderService;

    @Transactional
    @Override
    public LoginRes verifyWithCodeAndSendUserData(Integer code, HttpServletResponse response) {
        User user = userRepository.findOneByVerifyCode(code);

        if (user == null) {
            throw new IllegalArgumentException("Code noto‘g‘ri");
        }

        if (user.getVerifyCodeExpiration().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Code expired");
        }
        String token = jwtService.generateToken(user);

        mySecurityFilter.setJwtCookie(response, token);

        var auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        UserProfileOrdersRes profileOrdersById = orderService.getUserProfileOrdersById(user.getId());

        UserRes userRes = UserRes.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .phone(user.getPhone())
                .roles(user.getRoles().stream().map(Role::getName).toList())
                .ordersRes(profileOrdersById)
                .build();

        return LoginRes.builder()
                .token(token)
                .userRes(userRes)
                .build();
    }

    @Override
    public void logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("prime-token", null);
        cookie.setHttpOnly(true);
        cookie.setDomain("howdy.uz");
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "None");
        response.addCookie(cookie);
    }
}