// Formulaire de contact : vérifie la demande puis l'envoie par e-mail (Brevo) à tarik.abas@growthify.fr.
import { type Ctx, reply, clean, escapeHtml, isEmail, verifyTurnstile, sendEmail } from './shared';

export async function handleContact({ request, env }: Ctx) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(request, false, 'Formulaire invalide.');
  }

  // Champ piège : invisible pour les humains, rempli par les robots.
  if (clean(form.get('website'))) return reply(request, true, 'Merci, votre message a bien été envoyé.');

  const data = {
    firstName: clean(form.get('firstName'), 80),
    lastName: clean(form.get('lastName'), 80),
    email: clean(form.get('email'), 160),
    phone: clean(form.get('phone'), 40),
    company: clean(form.get('company'), 120),
    service: clean(form.get('service'), 120),
    message: clean(form.get('message'), 5000),
    consent: !!form.get('consent'),
  };

  if (!data.firstName || !data.lastName || !data.message) return reply(request, false, 'Merci de remplir les champs obligatoires.');
  if (!isEmail(data.email)) return reply(request, false, "L'adresse e-mail semble invalide.");
  if (!data.consent) return reply(request, false, 'Merci de cocher la case de consentement.');
  if (!(await verifyTurnstile(form, request, env))) return reply(request, false, 'La vérification anti-robot a échoué. Rechargez la page et réessayez.');

  const name = `${data.firstName} ${data.lastName}`;
  const rows: [string, string][] = [
    ['Nom', name],
    ['E-mail', data.email],
    ['Téléphone', data.phone || '—'],
    ['Entreprise', data.company || '—'],
    ['Besoin', data.service || '—'],
  ];

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;color:#151e42">
      <h2 style="margin:0 0 16px">Nouveau message depuis growthify.fr</h2>
      <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
        ${rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#64748b;width:120px">${k}</td><td style="padding:6px 0"><strong>${escapeHtml(v)}</strong></td></tr>`).join('')}
      </table>
      <div style="padding:16px;border-radius:12px;background:#f1f5f9;white-space:pre-wrap">${escapeHtml(data.message)}</div>
      <p style="color:#64748b;font-size:13px;margin-top:20px">Répondez directement à cet e-mail pour écrire à ${escapeHtml(name)}.</p>
    </div>`;
  const text = `${rows.map(([k, v]) => `${k} : ${v}`).join('\n')}\n\n${data.message}`;

  try {
    await sendEmail(env, {
      subject: `Contact site : ${name}${data.service ? ` (${data.service})` : ''}`,
      html,
      text,
      replyTo: { email: data.email, name },
    });
  } catch (err) {
    console.error(err);
    return reply(request, false, "L'envoi a échoué. Écrivez-nous directement à contact@growthify.fr.", 502);
  }

  return reply(request, true, 'Merci ! Votre message a bien été envoyé, nous revenons vers vous sous 24 h ouvrées.');
}
