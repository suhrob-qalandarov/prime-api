package org.exp.primeapp.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.coyote.BadRequestException;
import org.exp.primeapp.configs.security.JwtService;
import org.exp.primeapp.dto.request.LoginReq;
import org.exp.primeapp.dto.request.RegisterReq;
import org.exp.primeapp.dto.responce.LoginRes;
import org.exp.primeapp.models.entities.Role;
import org.exp.primeapp.models.entities.User;
import org.exp.primeapp.models.repo.RoleRepository;
import org.exp.primeapp.models.repo.UserRepository;
import org.exp.primeapp.service.interfaces.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.exp.primeapp.utils.Const.*;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;


    @Override
    public LoginRes login(LoginReq loginReq) {
        var auth = new UsernamePasswordAuthenticationToken(
                loginReq.getEmail(),
                loginReq.getPassword()
        );
        authenticationManager.authenticate(auth);
        String token = jwtService.generateToken(loginReq.getEmail());
        String refreshToken = jwtService.generateRefreshToken(loginReq.getEmail());

        return new LoginRes(
                token,
                refreshToken
        );
    }

    @SneakyThrows
    @Override
    public User register(RegisterReq registerDTO) {
        if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
            throw new BadRequestException(PASSWORD_NO_MATCH_MSG);
        }

        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new BadRequestException(EMAIL_EXIST_MSG);
        }

        User user = User.builder()
                .firstName(registerDTO.getFirstName())
                .lastName(registerDTO.getLastName())
                .email(registerDTO.getEmail())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .phone(registerDTO.getPhone())
                ._active(true)
                .build();

        List<Role> roleUser = roleRepository.findALlByNameIn(List.of("ROLE_USER"));
        user.setRoles(roleUser);
        return userRepository.save(user);
    }
}
