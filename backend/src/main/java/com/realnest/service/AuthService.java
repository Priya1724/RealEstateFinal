package com.realnest.service;

import com.realnest.dto.AuthResponse;
import com.realnest.dto.LoginRequest;
import com.realnest.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
