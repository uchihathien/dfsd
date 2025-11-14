package getabec.backend.common.ex;

public class EmailExistsException extends RuntimeException {
    public EmailExistsException() { super("EMAIL_EXISTS"); }
}
