CREATE TABLE roles (name VARCHAR(20) PRIMARY KEY);
INSERT INTO roles(name) VALUES ('USER'), ('ADMIN');

CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password VARCHAR(255),
                       full_name VARCHAR(255),
                       role VARCHAR(20) REFERENCES roles(name) DEFAULT 'USER',
                       status VARCHAR(20) DEFAULT 'ACTIVE',
                       created_at TIMESTAMP DEFAULT now(),
                       updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE password_reset_tokens (
                                       id BIGSERIAL PRIMARY KEY,
                                       user_id BIGINT REFERENCES users(id),
                                       token VARCHAR(64) UNIQUE NOT NULL,
                                       expires_at TIMESTAMP NOT NULL,
                                       used BOOLEAN DEFAULT FALSE
);

-- Liên kết tài khoản OAuth (Google/Facebook) -> User
CREATE TABLE oauth_accounts (
                                id BIGSERIAL PRIMARY KEY,
                                provider VARCHAR(20) NOT NULL,            -- 'google' | 'facebook'
                                provider_user_id VARCHAR(255) NOT NULL,   -- sub (Google) / id (Facebook)
                                user_id BIGINT REFERENCES users(id),
                                UNIQUE (provider, provider_user_id)
);
