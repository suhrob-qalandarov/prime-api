package org.exp.primeapp.controller;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.IOException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public void handleEntityNotFound(EntityNotFoundException e, HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public void handleIllegalArgument(IllegalArgumentException e, HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        response.getWriter().write(e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public void handleGeneralException(Exception e, HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getWriter().write("Internal server error");
    }
}