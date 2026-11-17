import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type HeroProps = {
  name: string;
  title: string;
  summary: string;
  highlights?: string[];
};

const defaultHighlights = ["Cloud-native systems", "Microservices", "AI workflows"];

export default function Hero({ name, title, summary, highlights = defaultHighlights }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");
  const enter = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.72, ease: [0.22, 1, 0.36, 1] as const },
  });
  const phoneNumber = "917204502694";
  const message = "Hi Chinmai, I saw your work and wanted to reach out about a project.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;


  return (
    <section className="hero-copy space-y-4">
      <motion.div {...enter(0.04)} className="hero-kicker">
        <span className="hero-kicker-spark"><Sparkles size={13} /></span>
        <span>Independent engineer</span>
        <i />
        <span>Karnataka, India</span>
        <b>01 / 04</b>
      </motion.div>

      <motion.h1 {...enter(0.1)} aria-label={name} className="hero-title riso-headline">
        <span className="hero-title-line">Hello, I’m</span>
        <span className="hero-name-line">{firstName}<span className="hero-name-period">.</span></span>
        <span className="hero-surname">{lastName}</span>
      </motion.h1>

      <motion.div {...enter(0.18)} className="hero-intro">
        <p className="hero-role">{title}</p>
        <p className="hero-summary">{summary}</p>
      </motion.div>

      <motion.div {...enter(0.24)} className="hero-highlights" aria-label="Areas of focus">
        {highlights.map((item, index) => (
          <span className={`hero-highlight hero-highlight-${index % 3}`} key={item}>{item}</span>
        ))}
      </motion.div>

      <motion.div {...enter(0.3)} className="hero-actions">
        <a href="#work" className="hero-primary-link">
          Explore my work <ArrowDownRight className="h-4 w-4" />
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-secondary-link"
        >
          Start a conversation <ArrowUpRight className="h-4 w-4" />
        </a>
      </motion.div>
      <motion.p {...enter(0.36)} className="hero-signoff">Thoughtful systems. Useful software. Good people.</motion.p>
    </section>
  );
}
