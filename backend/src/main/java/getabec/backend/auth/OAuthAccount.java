package getabec.backend.auth;

import getabec.backend.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

// auth/OAuthAccount.java
@Entity
@Table(name="oauth_accounts")
@Getter
@Setter
public class OAuthAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String provider;        // "google" | "facebook"
    private String providerUserId;  // sub (Google) | id (Facebook)
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="user_id")
    private User user;
}

