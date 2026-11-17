import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bot,
  ChevronDown,
  Check,
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type Status = "idle" | "sending" | "success" | "error";

const subjects = [
  { value: "project-collaboration", label: "Project collaboration", note: "Build something together" },
  { value: "freelance-work", label: "Freelance work", note: "A focused engagement" },
  { value: "job-opportunity", label: "Job opportunity", note: "A role or team introduction" },
  { value: "other", label: "Something else", note: "Start with a conversation" },
];

const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL as string;

const sendTelegramMessage = async (data: FormData): Promise<void> => {
  if (!CONTACT_API_URL) {
    throw new Error("Cannot make the request.");
  }

  const res = await fetch(CONTACT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    throw new Error(
      (err as { error?: string }).error ?? "Failed to send message.",
    );
  }
};

const ContactForm = () => {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [subjectIndex, setSubjectIndex] = useState(0);
  const subjectRef = useRef<HTMLDivElement>(null);

  const isConfigured = Boolean(CONTACT_API_URL);
  const selectedSubject = subjects.find((subject) => subject.value === form.subject);

  useEffect(() => {
    const handleOutsideClick = (event: PointerEvent) => {
      if (!subjectRef.current?.contains(event.target as Node)) setSubjectOpen(false);
    };
    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form.subject) {
      setStatus("error");
      setErrorMsg("Choose a subject so I know how best to respond.");
      document.getElementById("contact-subject")?.focus();
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      await sendTelegramMessage(form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const chooseSubject = (value: string) => {
    setForm((prev) => ({ ...prev, subject: value }));
    setSubjectOpen(false);
    setStatus("idle");
  };

  const handleSubjectKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!subjectOpen) {
        const currentIndex = subjects.findIndex((subject) => subject.value === form.subject);
        setSubjectIndex(currentIndex >= 0 ? currentIndex : 0);
        setSubjectOpen(true);
      } else {
        setSubjectIndex((current) => (current + (event.key === "ArrowDown" ? 1 : subjects.length - 1)) % subjects.length);
      }
    } else if (event.key === "Home" && subjectOpen) {
      event.preventDefault();
      setSubjectIndex(0);
    } else if (event.key === "End" && subjectOpen) {
      event.preventDefault();
      setSubjectIndex(subjects.length - 1);
    } else if (event.key === "Enter" && subjectOpen) {
      event.preventDefault();
      chooseSubject(subjects[subjectIndex].value);
    } else if (event.key === "Escape") {
      setSubjectOpen(false);
    }
  };

  const inputCls =
    "riso-input w-full px-4 py-3 text-sm text-[var(--theme-text-soft)] placeholder:text-[var(--theme-text-muted)] focus:outline-none transition-all";

  return (
    <section id="contact" className="riso-contact mx-auto max-w-4xl px-0 pb-16">
      {/* Section header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="theme-surface-soft flex h-10 w-10 items-center justify-center rounded-xl">
            <Send className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="riso-headline text-2xl font-bold text-white">Let’s build something thoughtful.</h2>
            <p className="text-sm mt-0.5 text-(--theme-text-muted)">
              Send me a message — I'll get back to you shortly.
            </p>
          </div>
        </div>

        {/* Telegram badge */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border self-start sm:self-auto ${
            isConfigured
              ? "theme-accent-soft"
              : "bg-red-500/10 border-red-500/20 text-red-300"
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          {isConfigured ? "Connected" : "Not configured"}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Info card */}
        <div className="space-y-4">
          <div className="contact-aside theme-surface-strong rounded-2xl p-6 space-y-6">
            <div>
              <p className="riso-overline text-xs uppercase tracking-[0.18em] font-semibold mb-2">A good place to start</p>
              <p className="text-sm leading-6 text-(--theme-text-muted)">Share a little context about what you’re making, the team you’re building, or the problem you’re trying to solve.</p>
            </div>
            <div>
              <p className="riso-overline text-xs uppercase tracking-[0.18em] font-semibold mb-1">
                Response time
              </p>
              <p className="text-sm text-(--theme-text-soft)">
                Usually within 24 hours
              </p>
            </div>
            <div>
              <p className="riso-overline text-xs uppercase tracking-[0.18em] font-semibold mb-1">
                Open to
              </p>
              <ul className="space-y-1.5 text-sm text-(--theme-text-muted)">
                {[
                  "Freelance projects",
                  "Full-time opportunities",
                  "Technical consultations",
                  "Open source collaboration",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {!isConfigured && (
            <div className="theme-surface-soft rounded-xl p-4 text-xs text-amber-300 leading-relaxed">
              <p className="font-semibold mb-1">Setup required</p>
              <p>
                Missing{" "}
                <span className="rounded bg-amber-500/10 px-1 text-amber-200">
                  configurations
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <div>
          <form
            onSubmit={handleSubmit}
            className="contact-form theme-surface-strong rounded-2xl p-5 sm:p-6 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-name"
                  className="riso-overline text-xs uppercase tracking-[0.16em] font-medium"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={inputCls}
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-email"
                  className="riso-overline text-xs uppercase tracking-[0.16em] font-medium"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="subject-field space-y-1.5" ref={subjectRef}>
              <label id="contact-subject-label" className="riso-overline text-xs uppercase tracking-[0.16em] font-medium">I’m reaching out about</label>
              <input type="hidden" name="subject" value={form.subject} />
              <button
                id="contact-subject"
                type="button"
                role="combobox"
                aria-labelledby="contact-subject-label"
                aria-controls="contact-subject-options"
                aria-expanded={subjectOpen}
                aria-haspopup="listbox"
                aria-activedescendant={subjectOpen ? `contact-subject-option-${subjectIndex}` : undefined}
                aria-required="true"
                aria-invalid={status === "error" && !form.subject}
                aria-describedby={status === "error" && !form.subject ? "contact-subject-error" : undefined}
                onClick={() => {
                  const selectedIndex = subjects.findIndex((subject) => subject.value === form.subject);
                  setSubjectIndex(selectedIndex >= 0 ? selectedIndex : 0);
                  setSubjectOpen((open) => !open);
                }}
                onKeyDown={handleSubjectKeyDown}
                className={`subject-trigger riso-input flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-all ${selectedSubject ? "has-selection" : "is-placeholder"}`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="subject-trigger-icon"><Send size={15} /></span>
                  <span className="truncate">{selectedSubject?.label ?? "Choose a conversation topic"}</span>
                </span>
                <ChevronDown className={`subject-chevron size-4 shrink-0 transition-transform ${subjectOpen ? "rotate-180" : ""}`} />
              </button>
              {subjectOpen && (
                <div className="subject-menu" id="contact-subject-options" role="listbox" aria-labelledby="contact-subject-label">
                  <p className="subject-menu-heading">Pick a starting point</p>
                  {subjects.map((subject, index) => (
                    <button
                      id={`contact-subject-option-${index}`}
                      key={subject.value}
                      type="button"
                      role="option"
                      aria-selected={form.subject === subject.value}
                      onMouseEnter={() => setSubjectIndex(index)}
                      onClick={() => chooseSubject(subject.value)}
                      className={`subject-option ${subjectIndex === index ? "is-active" : ""}`}
                    >
                      <span className="subject-option-mark"><span /></span>
                      <span className="subject-option-copy"><strong>{subject.label}</strong><small>{subject.note}</small></span>
                      {form.subject === subject.value && <Check className="subject-option-check size-4" />}
                    </button>
                  ))}
                </div>
              )}
              {status === "error" && !form.subject && <p id="contact-subject-error" className="subject-error" role="alert">Choose a topic before sending.</p>}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="contact-message"
                className="riso-overline text-xs uppercase tracking-[0.16em] font-medium"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project or opportunity…"
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Status feedback */}
            {status === "success" && (
              <div role="status" aria-live="polite" className="theme-accent-soft flex items-center gap-2 rounded-xl px-4 py-3 text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Message sent successfully! I'll reply soon.
              </div>
            )}
            {status === "error" && (
              <div role="alert" className="flex items-center gap-2 text-red-300 bg-red-500/10 border border-red-300/20 rounded-xl px-4 py-3 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending" || !isConfigured}
              className="riso-submit w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] cursor-pointer"
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
