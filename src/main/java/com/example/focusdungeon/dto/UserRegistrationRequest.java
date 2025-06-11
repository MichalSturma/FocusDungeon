package com.example.focusdungeon.dto;

public class UserRegistrationRequest {
    private String username;
    private String email;
    private String password;

    // Gettery a Settery
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}