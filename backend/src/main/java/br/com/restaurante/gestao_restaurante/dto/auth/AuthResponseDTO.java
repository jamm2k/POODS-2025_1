package br.com.restaurante.gestao_restaurante.dto.auth;

import java.util.Map;

public class AuthResponseDTO {
    private String token;
    private Map<String, Object> user;

    public AuthResponseDTO() {
    }

    public AuthResponseDTO(String token) {
        this.token = token;
    }

    public AuthResponseDTO(String token, Map<String, Object> user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Map<String, Object> getUser() {
        return user;
    }

    public void setUser(Map<String, Object> user) {
        this.user = user;
    }
}