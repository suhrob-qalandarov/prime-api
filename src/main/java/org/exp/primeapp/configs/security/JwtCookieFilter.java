package org.exp.primeapp.configs.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.exp.primeapp.models.entities.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import static org.exp.primeapp.utils.Const.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtCookieFilter extends OncePerRequestFilter {

    private final JwtCookieService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Get token from header
        String token = request.getHeader(AUTHORIZATION);
        log.info("Token extracted from header: {}", token);

        // Check id doesn't exist, get from cookie
        if (token == null) {
            token = jwtService.extractTokenFromCookie(request);
            log.info("Token extracted from cookie: {}", token);
        }

        if (token != null) {
            try {
                if (jwtService.validateToken(token)) {
                    User user = jwtService.getUserObject(token);
                    log.info("Validated user: {}", user);

                    if (user == null || user.getId() == null) {
                        log.error("User or ID is null from token: {}", user);
                        response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
                        response.getWriter().write("Invalid user data from token");
                        throw new IllegalArgumentException("Invalid user data from token");
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