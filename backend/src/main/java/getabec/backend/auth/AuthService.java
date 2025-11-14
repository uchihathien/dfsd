package getabec.backend.auth;

import getabec.backend.auth.dto.LoginRequest;
import getabec.backend.auth.dto.RegisterRequest;
import getabec.backend.auth.dto.TokenResponse;
import getabec.backend.common.ex.EmailExistsException;
import getabec.backend.common.ex.InvalidCredentialsException;
import getabec.backend.common.ex.WeakPasswordException;
import getabec.backend.user.User;
import getabec.backend.user.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// auth/AuthService.java
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final PasswordPolicy passwordPolicy;


    public TokenResponse register(RegisterRequest r) {
        String email = r.email().trim().toLowerCase();

        // kiểm tra email đã đăng ký
        if (userRepo.findByEmail(email).isPresent()) {
            throw new EmailExistsException();
        }

        // kiểm tra độ mạnh mật khẩu (ngoài @Size, @NotBlank)
        var pwErrors = passwordPolicy.validate(r.password());
        if (!pwErrors.isEmpty()) {
            throw new WeakPasswordException(pwErrors);
        }

        var u = new User();
        u.setEmail(email);
        u.setPassword(encoder.encode(r.password()));
        u.setFullName(r.fullName().trim());

        try {
            userRepo.save(u);
        } catch (DataIntegrityViolationException ex) {
            // phòng trường hợp race, unique index trên email vẫn đảm bảo
            throw new EmailExistsException();
        }

        var ud = new org.springframework.security.core.userdetails.User(
                u.getEmail(), "", List.of(new SimpleGrantedAuthority("ROLE_"+u.getRole()))
        );
        return new TokenResponse(jwt.generateAccessToken(ud), jwt.generateRefreshToken(ud));
    }

    public TokenResponse login(LoginRequest r) {
        var u = userRepo.findByEmail(r.email().toLowerCase())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS")
                );

        if (u.getPassword() == null || !encoder.matches(r.password(), u.getPassword())) {
            throw new InvalidCredentialsException();
        }

        return tokensFor(u.getEmail());
    }


    public TokenResponse refresh(String refreshToken) {
        String email = jwt.extractUsername(refreshToken);
        return tokensFor(email);
    }

    private TokenResponse tokensFor(String email) {
        var ud = new org.springframework.security.core.userdetails.User(email, "", List.of(new SimpleGrantedAuthority("ROLE_USER")));
        return new TokenResponse(jwt.generateAccessToken(ud), jwt.generateRefreshToken(ud));
    }

    private String dummyHash;

    @PostConstruct
    void initDummy() {
        // Tạo 1 hash hợp lệ khi khởi động (salt random) -> dùng cho matches() khi user không tồn tại
        this.dummyHash = encoder.encode("Dummy#12345");
    }



}
