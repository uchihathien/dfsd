package getabec.backend.auth;

import getabec.backend.auth.PasswordResetTokenRepository;
import getabec.backend.auth.model.PasswordResetToken;
import getabec.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.springframework.mail.javamail.JavaMailSender;

// auth/PasswordResetService.java
@Service
@RequiredArgsConstructor
public class PasswordResetService {
    private final UserRepository userRepo;
    private final PasswordResetTokenRepository tokenRepo;
    private final JavaMailSender mailSender;

    @Value("${mail.from}") private String from;

    public void requestReset(String email, String frontendResetBaseUrl) {
        var user = userRepo.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new RuntimeException("EMAIL_NOT_FOUND"));

        String token = UUID.randomUUID().toString().replace("-", "");
        var t = new PasswordResetToken();
        t.setUser(user);
        t.setToken(token);
        t.setExpiresAt(Instant.now().plus(30, ChronoUnit.MINUTES));
        tokenRepo.save(t);

        String link = frontendResetBaseUrl + "/" + token; // ví dụ: http://localhost:3000/reset/<token>
        var msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(user.getEmail());
        msg.setSubject("[Ecommerce] Đặt lại mật khẩu");
        msg.setText("Nhấn vào liên kết để đặt lại mật khẩu: " + link);
        mailSender.send(msg);
    }

    public void resetPassword(String token, String newPassword, PasswordEncoder encoder) {
        var t = tokenRepo.findByToken(token).orElseThrow(() -> new RuntimeException("INVALID_TOKEN"));
        if (t.isUsed() || t.getExpiresAt().isBefore(Instant.now()))
            throw new RuntimeException("TOKEN_EXPIRED");
        var u = t.getUser();
        u.setPassword(encoder.encode(newPassword));
        userRepo.save(u);
        t.setUsed(true);
        tokenRepo.save(t);
    }
}
