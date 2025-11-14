package getabec.backend.auth;

import getabec.backend.auth.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

// auth/PasswordResetController.java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {
    private final PasswordResetService service;
    private final PasswordEncoder encoder;

    @PostMapping("/forgot")
    public Map<String,String> forgot(@RequestBody Map<String,String> body) {
        String email = body.get("email");
        String resetBaseUrl = body.getOrDefault("resetBaseUrl", "http://localhost:3000/reset");
        service.requestReset(email, resetBaseUrl);
        return Map.of("ok","true");
    }

    @PostMapping("/reset")
    public Map<String,String> reset(@RequestBody Map<String,String> body) {
        service.resetPassword(body.get("token"), body.get("newPassword"), encoder);
        return Map.of("ok","true");
    }
}
