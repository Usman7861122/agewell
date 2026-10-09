import { useEffect, useState, type FormEvent } from 'react';

const interests = [
  { v: 'longevity', l: 'Longevity' },
  { v: 'metabolic', l: 'Metabolic Health or Weight Management' },
  { v: 'hormone', l: 'Hormone Care' },
  { v: 'hair', l: 'Hair Restoration' },
  { v: 'aesthetics', l: 'Aesthetics' },
  { v: 'not-sure', l: 'Not Sure' },
];

type Errors = Partial<Record<'name' | 'contact' | 'interest', string>>;

// Short inquiry form per the brief: no medical history. Set PUBLIC_FORM_ENDPOINT to post to a real backend.
export default function ContactForm() {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [interest, setInterest] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('interest');
    if (p && interests.some((i) => i.v === p)) setInterest(p);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') || '').trim();
    const contact = String(f.get('contact') || '').trim();
    const errs: Errors = {};
    if (!name) errs.name = 'Please enter your name.';
    if (!contact) errs.contact = method === 'email' ? 'Please enter your email address.' : 'Please enter your phone number.';
    else if (method === 'email' && !/^\S+@\S+\.\S+$/.test(contact)) errs.contact = 'That email does not look right. Please check it.';
    else if (method === 'phone' && contact.replace(/\D/g, '').length < 10) errs.contact = 'Please enter a 10-digit phone number.';
    if (!interest) errs.interest = 'Please choose what you are interested in.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus('sending');
    try {
      const endpoint = import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined;
      if (endpoint) {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, method, contact, interest }) });
        if (!res.ok) throw new Error('bad response');
      }
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div role="status" className="rounded-2xl bg-white p-8 text-ink">
        <p className="font-display text-2xl uppercase tracking-wide text-brand">Thank you</p>
        <p className="mt-3">We have received your request. Our team will reach out using your preferred contact method.</p>
        <p className="mt-3 text-sm text-ink/70">If you need help sooner, please call us.</p>
      </div>
    );
  }

  const field = 'mt-2 block min-h-[48px] w-full rounded-lg border border-ink/30 bg-white px-4 text-base text-ink placeholder:text-ink/50';
  const err = 'mt-1.5 text-sm font-semibold text-[#b3261e]';

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl bg-white p-6 text-ink shadow-xl sm:p-8" aria-describedby="form-note">
      <div>
        <label htmlFor="f-name" className="font-semibold">Name</label>
        <input id="f-name" name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} />
        {errors.name && <p id="e-name" className={err}>{errors.name}</p>}
      </div>

      <fieldset>
        <legend className="font-semibold">Preferred contact method</legend>
        <div className="mt-2 flex gap-3">
          {(['email', 'phone'] as const).map((m) => (
            <label key={m} className={`flex min-h-[48px] flex-1 cursor-pointer items-center justify-center rounded-lg border-2 px-4 font-semibold capitalize ${method === m ? 'border-brand bg-brand-50 text-brand' : 'border-ink/20'}`}>
              <input type="radio" name="method" value={m} checked={method === m} onChange={() => setMethod(m)} className="sr-only" />
              {m}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="f-contact" className="font-semibold">{method === 'email' ? 'Email address' : 'Phone number'}</label>
        <input id="f-contact" name="contact" type={method === 'email' ? 'email' : 'tel'} autoComplete={method === 'email' ? 'email' : 'tel'} inputMode={method === 'email' ? 'email' : 'tel'}
          className={field} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? 'e-contact' : undefined} />
        {errors.contact && <p id="e-contact" className={err}>{errors.contact}</p>}
      </div>

      <div>
        <label htmlFor="f-interest" className="font-semibold">Service interest</label>
        <select id="f-interest" name="interest" value={interest} onChange={(e) => setInterest(e.target.value)} className={field} aria-invalid={!!errors.interest} aria-describedby={errors.interest ? 'e-interest' : undefined}>
          <option value="">Choose one</option>
          {interests.map((i) => <option key={i.v} value={i.v}>{i.l}</option>)}
        </select>
        {errors.interest && <p id="e-interest" className={err}>{errors.interest}</p>}
      </div>

      {status === 'error' && <p role="alert" className={err}>Something went wrong sending your request. Please try again or call us.</p>}

      <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full">{status === 'sending' ? 'Sending…' : 'Request Consultation'}</button>
      <p id="form-note" className="text-sm text-ink/70">Please do not include medical history in this form. We will discuss it with you privately during your consultation.</p>
    </form>
  );
}
