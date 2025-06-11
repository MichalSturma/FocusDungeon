package com.example.focusdungeon;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend requests
public class HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "Hello from Dungeon Backend chillax!";
    }
}
