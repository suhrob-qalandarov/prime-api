package org.exp.primeapp.configs.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.entities.User;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import static org.exp.primeapp.utils.Const.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class MySecurityFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull FilterChain filterChain) throws ServletException, IOException {
        String origin = request.getHeader("Origin");
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            if (origin != null && (
                    origin.equals("https://prime77.uz")
                    || origin.equals("http://localhost")
                    || origin.equals("http://localhost:8080")
            )) {
                response.setHeader("Access-Control-Allow-Origin", origin);
            }
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With");
            response.setHeader("Access-Control-Allow-Credentials", "true");
            return;
        }

        String token = request.getHeader(AUTHORIZATION);
        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                if (jwtService.validateToken(token)) {
                    User user = jwtService.getUserObject(token);

                    if (user == null || user.getTelegramId() == null) {
                        log.error("User or ID is null from token: {}", user);
                        throw new IllegalArgumentException("Invalid user data from token");
                    }

                    if (user.getActive() != null && !user.getActive()) {
                        log.warn("User is not active: {}", user.getPhone());
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.getWriter().write("User account is not active.");
                        return;
                    }

                    var auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                log.error("Invalid token: {}", e.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }
}