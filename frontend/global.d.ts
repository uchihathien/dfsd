// global.d.ts
interface Window {
    google: {
        accounts: {
            id: {
                initialize: (opts: {
                    client_id: string;
                    callback: (resp: { credential: string }) => void
                }) => void;
                renderButton: (el: HTMLElement, opts: { theme?: string; size?: string; width?: string | number }) => void;
                prompt: () => void;
            };
        };
    };
}
