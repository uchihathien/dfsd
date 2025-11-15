package getabec.backend.auth;

import getabec.backend.auth.dto.AuthResponse;
import getabec.backend.auth.dto.LoginRequest;
import getabec.backend.auth.dto.RegisterRequest;
import getabec.backend.auth.dto.TokenResponse;
import getabec.backend.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// auth/AuthController.java
@RestController
@RequestMapping({"/api/auth", "/auth"})
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepo;

    @PostMapping("/register")
    public TokenResponse register(@Valid @RequestBody RegisterRequest req) {
        return authService.register(req);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/refresh")
    public TokenResponse refresh(@RequestBody Map<String,String> req) {
        return authService.refresh(req.get("refreshToken"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        var u = userRepo.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(Map.of(
                "email", u.getEmail(),
                "fullName", u.getFullName(),
                "role", u.getRole()
        ));
    }

    @GetMapping("/check-email")
    public Map<String, Boolean> checkEmail(@RequestParam String email) {
        boolean exists = userRepo.findByEmail(email.trim().toLowerCase()).isPresent();
        return Map.of("exists", exists);
    }


}
