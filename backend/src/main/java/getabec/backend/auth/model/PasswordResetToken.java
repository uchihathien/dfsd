package getabec.backend.auth.model;

import getabec.backend.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name="password_reset_tokens")
@Getter
@Setter
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="user_id")
    private User user;
    @Column(unique = true, nullable = false) private String token;
    private Instant expiresAt;
    private boolean used = false;
}
