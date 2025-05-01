package example.com.security;

import example.com.model.User;
import example.com.repository.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final UserRepository userRepository;

    private final String secret = "mysecuresecretkeymysecuresecretkey"; // 32+ karakter
    private final long expiration = 1000 * 60 * 60; // 1 saat

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Token oluşturma: username + rol bilgisi
    public String generateToken(String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Kullanıcı bulunamadı: " + username);
        }

        String role = optionalUser.get().getRole().name();

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role) // 👈 rol bilgisi eklendi
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Token'dan kullanıcı adını al
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Token'dan rolü al
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // Genel geçer claim çekici
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Token geçerli mi?
    public boolean isTokenValid(String token, String username) {
        return extractUsername(token).equals(username);
    }
}
