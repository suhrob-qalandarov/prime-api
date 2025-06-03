package org.exp.primeapp.service.impl.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.coyote.BadRequestException;
import org.exp.primeapp.configs.security.JwtService;
import org.exp.primeapp.dto.LoginDTO;
import org.exp.primeapp.dto.RegisterDTO;
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

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;


    @Override
    public LoginRes login(LoginDTO loginDTO) {
        var auth = new UsernamePasswordAuthenticationToken(
                loginDTO.getEmail(),
                loginDTO.getPassword()
        );
        authenticationManager.authenticate(auth);
        String token = jwtService.generateToken(loginDTO.getEmail());
        return new LoginRes(
                token
        );
    }

    @SneakyThrows
    @Override
    public void register(RegisterDTO registerDTO) {
        if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
        User user = new User();
        user.setEmail(registerDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setFirstName(registerDTO.getFirstName());
        user.setLastName(registerDTO.getLastName());
        user.setPhone(registerDTO.getPhone());
        List<Role> roleUser = roleRepository.findALlByNameIn(List.of("ROLE_USER"));
        user.setRoles(roleUser);
        userRepository.save(user);
    }
}
