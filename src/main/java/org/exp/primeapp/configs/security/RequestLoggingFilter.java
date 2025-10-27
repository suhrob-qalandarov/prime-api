package org.exp.primeapp.configs.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        logger.info("Request URL: {}", request.getRequestURL());
        logger.info("Request Content-Type: {}", request.getContentType());
        filterChain.doFilter(request, response);
    }
}