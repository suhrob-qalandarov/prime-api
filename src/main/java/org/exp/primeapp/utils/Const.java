package org.exp.primeapp.utils;

public interface Const {
    String WAY_ALL = "/*";

    String API = "/api";
    //String VERSION = "/version";
    String V1 = "/v1";

    String AUTH_HEADER = "Authorization";
    String TOKEN_PREFIX = "Bearer ";

    String AUTH = "/auth";
    String LOGIN = "/login";
    String REGISTER = "/register";
    String VERIFY = "/verify";
    String LOGOUT = "/logout";

    String CATEGORY = "/category";
    String ATTACHMENT = "/attachment";

    String EMAIL_EXIST_MSG = "Email already exist!";
    String PASSWORD_NO_MATCH_MSG = "Passwords do not match!";

    String ROLE_MEGA_SUPER_ADMIN ="ROLE_MEGA_SUPER_ADMIN";
    String ROLE_SUPER_ADMIN ="ROLE_SUPER_ADMIN";
    String ROLE_ADMIN ="ROLE_ADMIN";
    String ROLE_USER ="ROLE_USER";

}
