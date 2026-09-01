import { useEffect, useRef } from 'react';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleSignInButton({ onCredential, text = 'continue_with' }) {
  const divRef = useRef(null);

  useEffect(() => {
    if (!CLIENT_ID || !divRef.current) return;

    const render = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response) => {
          if (response?.credential) onCredential?.(response.credential);
        },
      });
      divRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(divRef.current, {
        theme: 'outline',
        size: 'large',
        text,
        width: 320,
      });
    };

    if (window.google?.accounts?.id) {
      render();
      return;
    }

    const existing = document.querySelector('script[data-google-gsi]');
    if (existing) {
      existing.addEventListener('load', render);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.dataset.googleGsi = '1';
    script.onload = render;
    document.body.appendChild(script);
  }, [onCredential, text]);

  if (!CLIENT_ID || CLIENT_ID.startsWith('REPLACE_')) {
    return (
      <p className="text-center text-xs text-zinc-500">
        Set VITE_GOOGLE_CLIENT_ID in .env.local for Google sign-in.
      </p>
    );
  }

  return <div ref={divRef} className="flex justify-center min-h-[40px]" />;
}
