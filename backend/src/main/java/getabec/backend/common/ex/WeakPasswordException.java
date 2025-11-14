package getabec.backend.common.ex;

import java.util.List;

public class WeakPasswordException extends RuntimeException {
    private final List<String> reasons;
    public WeakPasswordException(List<String> reasons) {
        super("WEAK_PASSWORD");
        this.reasons = reasons;
    }
    public List<String> getReasons() { return reasons; }
}
