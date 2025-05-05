package example.com.controller;

import example.com.dto.LoginRequest;
import example.com.dto.RegisterRequest;
import example.com.exception.UserAlreadyExistsException;
import example.com.model.Role;
import example.com.model.User;
import example.com.repository.UserRepository;
import example.com.security.JwtService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Getter
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        System.out.println("Login endpoint hit: " + request.getUsername());
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        String token = jwtService.generateToken(user);

        return Map.of("token", token);
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("Kullanıcı zaten mevcut");
        }

        Role role = Role.USER;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
            role = Role.ADMIN;
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(request.getPassword()) // Şifrelenmiyor!!!
                .role(role)
                .build();

        userRepository.save(user);

        // Token üret
        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(Map.of("token", token));
    }


}
