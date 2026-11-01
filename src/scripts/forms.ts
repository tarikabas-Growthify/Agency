// Envoi des formulaires (contact, newsletter) sans recharger la page.
// Les données partent vers les fonctions Cloudflare /api/contact et /api/newsletter.

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
    __turnstileLoading?: Promise<void>;
  }
}

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  window.__turnstileLoading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('turnstile'));
    document.head.appendChild(s);
  });
  return window.__turnstileLoading;
}

async function renderTurnstiles() {
  const widgets = document.querySelectorAll<HTMLElement>('[data-turnstile]:not([data-rendered])');
  if (!widgets.length) return;
  try {
    await loadTurnstile();
  } catch {
    return;
  }
  widgets.forEach((el) => {
    el.dataset.rendered = '1';
    el.dataset.widgetId = window.turnstile!.render(el, {
      sitekey: el.dataset.sitekey,
      theme: 'dark',
      size: 'flexible',
      appearance: 'interaction-only',
      language: 'fr',
    });
  });
}

const MESSAGES = {
  sending: 'Envoi en cours…',
  error: "Oups, l'envoi a échoué. Réessayez ou écrivez-nous à management@growthify.fr.",
};

export function initForms() {
  renderTurnstiles();

  document.querySelectorAll<HTMLFormElement>('form[data-form]:not([data-bound])').forEach((form) => {
    form.dataset.bound = '1';
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = form.querySelector<HTMLElement>('.form-status');
      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      const setStatus = (state: string, text: string) => {
        if (!status) return;
        status.dataset.state = state;
        status.textContent = text;
      };

      if (!form.reportValidity()) return;
      button?.setAttribute('disabled', '');
      setStatus('sending', MESSAGES.sending);

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
        if (!res.ok || !data.ok) throw new Error(data.message || MESSAGES.error);
        setStatus('success', data.message || 'Merci, c’est bien reçu !');
        form.reset();
        form.classList.add('is-sent');
      } catch (err) {
        setStatus('error', err instanceof Error && err.message ? err.message : MESSAGES.error);
      } finally {
        button?.removeAttribute('disabled');
        const widget = form.querySelector<HTMLElement>('[data-turnstile]');
        if (widget?.dataset.widgetId) window.turnstile?.reset(widget.dataset.widgetId);
      }
    });
  });
}
