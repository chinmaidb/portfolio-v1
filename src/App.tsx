import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "motion/react";
import {
  Mail,
  Phone,
  GitFork,
  MapPin,
  Briefcase,
  Code2,
  GraduationCap,
  ChevronRight,
  Terminal,
  Database,
  Server,
  Cpu,
  Globe,
  Rocket,
} from "lucide-react";

import badgeLogo from "./assets/logo-2.svg";
import ContactForm from "./components/ContactForm";
import Hero from "./components/Hero";
import Modal from "./components/Modal";

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
  tech: string[];
};

type ProjectItem = {
  title: string;
  description: string;
  icon: ReactNode;
};

const App = () => {
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState("experience");
  const [selectedItem, setSelectedItem] = useState<
    | { kind: "experience"; index: number }
    | { kind: "project"; index: number }
    | null
  >(null);

  const skills = {
    backend: [
      "Java (8,11,17,21)",
      "Spring Boot Ecosystem",
      "Golang",
      "Python",
      "FastAPI",
      "Apache Camel",
      "GraphQL",
      "OpenAPI3",
      "Frappe ERPNext",
    ],
    frontend: [
      "HTML5 & CSS3",
      "Svelte",
      "Astro",
      "Angular",
      "RxJS",
      "Javascript/Typescript",
    ],
    databases: [
      "MySQL",
      "PostgreSQL",
      "Oracle",
      "MongoDB",
      "MariaDB",
      "SQLite",
      "DuckDB",
    ],
    architecture: [
      "Domain Driven Design",
      "Microservices",
      "Clean Architecture",
      "Reactive Programming",
    ],
    tools: [
      "Docker",
      "Jenkins",
      "Dapr",
      "HashiCorp Vault",
      "Git",
      "IntelliJ IDEA",
      "Tomcat/Undertow/Netty",
      "Telegram",
      "AWS services",
    ],
  };

  const experience: ExperienceItem[] = [
    {
      role: "Entrepreneur / Co-founder",
      company: "ShreshtaSMG",
      period: "June 2025 - Present",
      description:
        "Building custom cloud-based software services and SaaS products to help businesses manage customer transactions.",
      highlights: [
        "Developed a CRM application using Golang, SQLite, and Svelte.",
        "Built a domain-specific Chatbot integrating open-source LLMs to generate image captions.",
        "Developed cloud-based accounting and invoicing software utilizing Python and MariaDB.",
        "Created an automated backup management system for AWS S3 using a Golang/MariaDB backend and terminal client.",
        "Implemented e-commerce plugins for GST handling and custom QR code payments.",
        "Built high-performance APIs with FastAPI and customized enterprise workflows using Frappe ERPNext.",
      ],
      tech: [
        "Golang",
        "Python",
        "FastAPI",
        "Frappe ERPNext",
        "Svelte",
        "MariaDB",
        "LLMs",
        "AWS S3",
      ],
    },
    {
      role: "Senior Developer / Lead",
      company: "HCL Technologies",
      period: "Sep 2020 - June 2025",
      description:
        "Led development of core corporate systems for Prudential using cutting-edge architectural patterns.",
      highlights: [
        "Designed Prudential systems using Clean Architecture, DDD, and Java 21 with Spring Boot.",
        "Deployed scalable microservices using DAPR sidecars for secure inter-service communication and token enhancement.",
        "Integrated major Payment Gateways (CyberSource, IPAY88, ABAPay, Acleda).",
        "Engineered a high-performance Python migration pipeline that successfully transferred 800K+ corporate policies.",
        "Mentored new joiners and managed DevOps and production deployment activities.",
      ],
      tech: [
        "Java 21",
        "Spring Boot",
        "Dapr",
        "Python",
        "Microservices",
        "Apache Camel",
      ],
    },
    {
      role: "Software Engineer",
      company: "ViewMyRecords / SVTPL",
      period: "Mar 2018 - Sep 2020",
      description:
        "Full-stack development for enterprise document management and administrative systems.",
      highlights: [
        "Developed REST APIs and UIs using Spring, Alfresco, and PostgresSQL for ViewMyRecords.",
        "Built bulk upload/indexing desktop applications utilizing Spring Boot Batch.",
        "Migrated client-facing apps to Angular with RxJS for high-performance reactive interfaces (Pistaceo & Pistaceo Admin).",
      ],
      tech: ["Angular", "Spring Boot", "RxJS", "PostgreSQL", "Alfresco"],
    },
    {
      role: "Member Technical Staff",
      company: "MAHAT CONSULTING",
      period: "Dec 2014 - Dec 2017",
      description:
        "Architected and developed diverse products ranging from event management to e-commerce and assessment tools.",
      highlights: [
        'Designed microservices architecture for "EventChai" using Spring Boot, Angular 4, and MongoDB.',
        "Built custom e-commerce platforms and automated Aptitude Test systems.",
        'Developed RESTful APIs for "Kona Coach" using Groovy on Grails.',
      ],
      tech: ["Spring Boot", "Angular", "MongoDB", "MySQL", "Groovy on Grails"],
    },
  ];

  const projects: ProjectItem[] = [
    {
      title: "Prudential Core Policy System",
      description:
        "A massive scale corporate insurance platform utilizing Clean Architecture, Domain Driven Design, and DAPR sidecars for multi-region microservices.",
      icon: <Server className="w-6 h-6 text-amber-400" />,
    },
    {
      title: "AI-Powered Business CRM",
      description:
        "A modern CRM featuring a custom LLM-based chatbot for image captioning and domain-specific query resolution, built with FastAPI and Svelte.",
      icon: <Cpu className="w-6 h-6 text-amber-400" />,
    },
    {
      title: "Cloud Accounting & Invoicing",
      description:
        "Python and MariaDB based multi-tenant system handling customer-specific invoices and taxation (GST) plugins.",
      icon: <Database className="w-6 h-6 text-amber-400" />,
    },
    {
      title: "High-Volume Policy Migrator",
      description:
        "Data engineering pipeline written in Python that successfully migrated over 800,000 complex insurance policies between disparate 3rd party systems.",
      icon: <Terminal className="w-6 h-6 text-amber-400" />,
    },
  ];

  useEffect(() => {
    const frame = requestAnimationFrame(() => setSelectedItem(null));
    return () => cancelAnimationFrame(frame);
  }, [activeTab]);

  const activeExperience =
    selectedItem?.kind === "experience" ? experience[selectedItem.index] : null;
  const activeProject =
    selectedItem?.kind === "project" ? projects[selectedItem.index] : null;


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={
        {
          "--theme-bg-start": "#07111f",
          "--theme-bg-accent": "#123a67",
        } as React.CSSProperties
      }
      className="theme-shell riso-print min-h-screen text-(--theme-text-soft) font-sans selection:bg-(--theme-selection) relative overflow-hidden"
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="riso-ink-field riso-ink-field-blue top-20 left-[-10%] h-72 w-125 -rotate-6"
        />

        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="riso-ink-field riso-ink-field-coral bottom-0 right-[-10%] h-64 w-100 rotate-3"
        />
      </div>

      {/* Header / Hero Section */}
      <header id="top" className="chapter-section relative z-10 overflow-hidden border-b border-white/10 pt-5 pb-12 min-h-[88vh] flex items-center">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-amber-400 via-orange-400 to-sky-400 origin-left"
        />

        <div className="scene-card max-w-6xl mx-auto px-6 relative z-10 w-full">
          <nav aria-label="Main navigation" className="portfolio-nav mb-12 flex items-center justify-between rounded-full px-4 py-2 sm:px-5">
            <a href="#top" className="flex items-center gap-2 text-xs font-semibold tracking-wide text-white"><span className="nav-mark">C</span><span className="hidden sm:inline">Chinmai D Bharadwaj</span></a>
            <div className="flex items-center gap-1 sm:gap-2">
              <a href="#work" className="nav-link">Experience</a>
              <a href="#expertise" className="nav-link">Expertise</a>
              <a href="#contact" className="nav-contact">Let’s talk <ChevronRight className="h-3.5 w-3.5" /></a>
            </div>
          </nav>
          <div className="hero-composition grid gap-10 xl:grid-cols-[1.12fr_0.88fr] xl:items-center">
            {/* Left Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="hero-copy-column space-y-5"
            >
              <motion.div
                variants={fadeUp}
                className="hero-availability-row flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <motion.div
                  whileHover={{
                    scale: 1.04,
                    y: -2,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className="hero-availability inline-flex items-center gap-2 rounded-full theme-surface-soft px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-amber-300 shadow-[0_14px_30px_rgba(15,23,42,0.35)]"
                >
                  <span className="availability-light" />
                  <Rocket className="w-4 h-4" />
                  Available for new opportunities
                </motion.div>
                <span className="hero-location-note">Shimoga, India <span>·</span> Working globally</span>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Hero
                  name="Chinmai D Bharadwaj"
                  title="Senior Full-Stack Engineer & Entrepreneur"
                  summary="I design and build dependable digital products, from early architecture to production systems. My work spans cloud platforms, distributed services, and practical AI integrations."
                />
              </motion.div>

              <motion.div variants={fadeUp} className="hero-contact-strip mt-3 flex flex-wrap gap-2 text-xs text-(--theme-text-muted) md:text-sm">
                <motion.a
                  whileHover={{
                    y: -2,
                    scale: 1.03,
                  }}
                  whileTap={{ scale: 0.98 }}
                  href="mailto:chinmai.bharadwaj@ymail.com"
                  className="theme-surface-soft inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition-all hover:border-[rgba(244,184,96,0.36)] hover:text-amber-300"
                >
                  <Mail className="w-4 h-4" />
                  chinmai.bharadwaj@ymail.com
                </motion.a>

                <span className="theme-surface-soft inline-flex items-center gap-2 rounded-full px-3 py-1.5">
                  <Phone className="w-4 h-4" />
                  +91 7975700560
                </span>

                <span className="theme-surface-soft inline-flex items-center gap-2 rounded-full px-3 py-1.5">
                  <MapPin className="w-4 h-4" />
                  Shimoga, Karnataka, India
                </span>
              </motion.div>

              <motion.div variants={fadeUp} className="hero-social-strip mt-2.5 flex flex-wrap gap-2.5">
                <motion.a
                  whileHover={{
                    scale: 1.05,
                    y: -3,
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  href="https://github.com/whiteblizzard9248"
                  target="_blank"
                  rel="noreferrer"
                  className="theme-surface inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-(--theme-text-soft) transition-all hover:border-[rgba(244,184,96,0.32)] hover:text-amber-300"
                >
                  <GitFork className="w-4 h-4" />
                  @whiteblizzard9248
                </motion.a>

                <motion.a
                  whileHover={{
                    scale: 1.05,
                    y: -3,
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  href="https://github.com/chinmaidb"
                  target="_blank"
                  rel="noreferrer"
                  className="theme-surface inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-(--theme-text-soft) transition-all hover:border-[rgba(244,184,96,0.32)] hover:text-amber-300"
                >
                  <GitFork className="w-4 h-4" />
                  @chinmaidb
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 40 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
              }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="hero-art-column relative"
            >
              <div className="hero-showcase relative min-h-[420px] overflow-hidden rounded-4xl theme-surface-strong sm:min-h-[510px]" role="img" aria-label="Illustrated software portfolio dashboard with delivery metrics, service architecture, and code panels">
                <div className="showcase-grid absolute inset-0" />
                <div className="showcase-kicker absolute left-6 top-6"><span>Product systems</span><b>FIELD NOTE / 01</b></div>

                <motion.div
                  className="product-console"
                  animate={reduceMotion ? {} : { y: [0, -7, 0], rotate: [0, -0.35, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="console-topbar">
                    <div className="console-window-dots"><i /><i /><i /></div>
                    <span>WORKSPACE / SYSTEMS</span>
                    <div className="console-live"><i /> LIVE</div>
                  </div>
                  <div className="console-layout">
                    <aside className="console-sidebar">
                      <span className="console-mark">C</span>
                      <i className="active" /><i /><i /><i />
                      <span className="console-sidebar-foot">DB</span>
                    </aside>
                    <div className="console-content">
                      <div className="console-heading">
                        <div><small>OVERVIEW / 2026</small><strong>Systems that scale.</strong></div>
                        <span className="console-avatar">CD</span>
                      </div>
                      <div className="console-metrics">
                        <div className="console-metric console-metric-coral"><small>POLICIES MIGRATED</small><strong>800<span>k+</span></strong><i>↗ 98.4% verified</i></div>
                        <div className="console-metric console-metric-lilac"><small>YEARS BUILDING</small><strong>12<span>+</span></strong><i>Across product & platform</i></div>
                      </div>
                      <div className="console-lower">
                        <div className="console-chart">
                          <div className="console-chart-title"><span>Delivery momentum</span><b>+24.8%</b></div>
                          <div className="console-bars">{[32, 48, 42, 69, 56, 82, 72, 94, 80, 100, 87, 112].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
                          <div className="console-chart-axis"><span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span></div>
                        </div>
                        <div className="console-stack">
                          <small>BUILT WITH</small>
                          <span><i className="stack-dot stack-java" />Java</span>
                          <span><i className="stack-dot stack-go" />Go</span>
                          <span><i className="stack-dot stack-python" />Python</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div className="architecture-float architecture-float-top" animate={reduceMotion ? {} : { y: [0, 6, 0], rotate: [2, 1, 2] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}>
                  <div className="architecture-float-icon">&lt;/&gt;</div>
                  <div><small>API LAYER</small><strong>Spring Boot</strong><i>12 services · healthy</i></div>
                  <span className="architecture-status" />
                </motion.div>

                <motion.div className="architecture-float architecture-float-bottom" animate={reduceMotion ? {} : { y: [0, -5, 0], rotate: [-2, -1, -2] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}>
                  <div className="architecture-node"><span /><span /><span /></div>
                  <div><small>CONNECTED SYSTEMS</small><strong>Cloud · Data · AI</strong></div>
                  <ChevronRight size={15} />
                </motion.div>

                <div className="showcase-tech-tags"><span>DESIGN</span><i /> <span>ENGINEER</span><i /> <span>SHIP</span></div>
                <div className="hero-sticker"><strong>12+</strong><span>years building<br/>for the real world</span></div>
              </div>

              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-3 right-3 flex items-center justify-center w-20 h-20 rounded-[1.25rem] theme-surface-strong shadow-[0_18px_45px_rgba(15,23,42,0.45)]"
              >
                <img
                  src={badgeLogo}
                  alt=""
                  aria-hidden="true"
                  className="w-11 h-11 drop-shadow-[0_0_22px_rgba(244,184,96,0.2)]"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.6,
                  duration: 0.8,
                }}
                className="absolute bottom-6 left-6 right-6 rounded-3xl theme-surface-strong p-4 shadow-[0_18px_45px_rgba(15,23,42,0.45)]"
              >
                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-amber-300 font-semibold">
                  Featured expertise
                </p>

                <p className="mt-2 text-sm text-(--theme-text-soft) leading-relaxed">
                  Thoughtful architecture, cloud platforms, and practical AI — made to work beautifully together.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="marquee-band relative z-10 overflow-hidden" aria-label="Architecture, engineering, and product craft">
        <div className="marquee-track" aria-hidden="true">
          {[0, 1].map((copy) => <div className="marquee-content" key={copy}><span>Architecture</span><i>✳</i><span>Engineering</span><i>✳</i><span>Product thinking</span><i>✳</i><span>Cloud native</span><i>✳</i><span>AI with purpose</span><i>✳</i><span>Architecture</span><i>✳</i><span>Engineering</span><i>✳</i><span>Product thinking</span><i>✳</i><span>Cloud native</span><i>✳</i><span>AI with purpose</span><i>✳</i></div>)}
        </div>
      </div>

      {/* Main Content */}
      <main id="work" className="portfolio-main relative z-10 max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-12 chapter-section">
        {/* Left Column */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="lg:col-span-1 space-y-12"
        >
          {/* Skills */}
          <motion.section id="expertise" variants={fadeUp}>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
              <Code2 className="w-6 h-6 text-amber-500" />
              What I work with
            </h3>

            <div className="space-y-6">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-(--theme-text-muted) uppercase tracking-[0.24em] mb-3">
                    {category}
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {items.map((skill, index) => (
                      <motion.span
                        key={skill}
                        initial={{
                          opacity: 0,
                          scale: 0.8,
                        }}
                        whileInView={{
                          opacity: 1,
                          scale: 1,
                        }}
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.03,
                          type: "spring",
                          stiffness: 300,
                          damping: 18,
                        }}
                        whileHover={{
                          scale: 1.08,
                          y: -3,
                        }}
                        className="theme-surface-soft px-3 py-1.5 rounded-md text-sm text-(--theme-text-soft) hover:text-amber-300 hover:border-[rgba(244,184,96,0.3)] transition-colors cursor-default"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Education */}
          <motion.section variants={fadeUp}>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
              <GraduationCap className="w-6 h-6 text-amber-500" />
              Education
            </h3>

            <motion.div
              whileHover={{
                y: -4,
                scale: 1.01,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="theme-surface-strong p-5 rounded-xl"
            >
              <h4 className="text-(--theme-text-soft) font-medium">
                B.E. in Mechanical Engineering
              </h4>

              <p className="text-sm text-(--theme-text-muted) mt-1">
                Government Engineering College, Hassan
              </p>

              <p className="text-xs text-(--theme-text-muted) mt-2">
                Affiliated to VTU Belgaum
              </p>
            </motion.div>
          </motion.section>
        </motion.div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* Tabs */}
          <div className="portfolio-tabs flex gap-4 border-b border-white/10 pb-px">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab("experience")}
              className={`pb-4 text-lg font-medium transition-colors relative ${
                activeTab === "experience"
                  ? "text-amber-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Experience
              </span>

              {activeTab === "experience" && (
                <motion.span
                  layoutId="tabIndicator"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-t-full"
                />
              )}
            </motion.button>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab("projects")}
              className={`pb-4 text-lg font-medium transition-colors relative ${
                activeTab === "projects"
                  ? "text-amber-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Selected projects
              </span>

              {activeTab === "projects" && (
                <motion.span
                  layoutId="tabIndicator"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-t-full"
                />
              )}
            </motion.button>
          </div>

          {/* Animated Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "experience" && (
              <motion.div
                key="experience"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="grid gap-6 md:grid-cols-2"
              >
                {experience.map((job, index) => (
                  <motion.button
                    type="button"
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 60,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      duration: 0.7,
                      delay: index * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onClick={() =>
                      setSelectedItem({ kind: "experience", index })
                    }
                    className="group text-left theme-surface-strong rounded-2xl p-5 border border-white/10 hover:border-[rgba(244,184,96,0.28)] transition-all shadow-sm hover:shadow-[0_18px_40px_rgba(244,184,96,0.06)] h-full cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="min-w-0">
                        <p className="text-[0.65rem] uppercase tracking-[0.28em] text-amber-300 font-semibold mb-2">
                          {job.period}
                        </p>
                        <h4 className="text-lg font-bold text-white leading-tight">
                          {job.role}
                        </h4>
                      </div>
                      <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl theme-surface-soft text-amber-300">
                        <Briefcase className="w-5 h-5" />
                      </div>
                    </div>

                    <h5 className="text-sm font-medium text-(--theme-text-muted) mb-3">
                      {job.company}
                    </h5>

                    <p className="text-sm text-(--theme-text-soft) mb-4 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="space-y-2.5">
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-(--theme-text-muted) font-medium">
                        Key Highlights
                      </p>
                      <div className="space-y-2">
                        {job.highlights.slice(0, 2).map((highlight, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 rounded-xl theme-surface-soft px-3 py-2"
                          >
                            <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-sm text-(--theme-text-muted) leading-relaxed">
                              {highlight}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-white/10">
                      {job.tech.slice(0, 4).map((tech, idx) => (
                        <motion.span
                          key={idx}
                          whileHover={{
                            scale: 1.03,
                            y: -1,
                          }}
                          className="text-[0.7rem] font-medium px-2.5 py-1 theme-surface-soft text-(--theme-text-muted) rounded-full"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                    <div className="mt-4 text-[0.68rem] uppercase tracking-[0.24em] text-amber-300 font-semibold">
                      Open details
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {projects.map((project, index) => (
                  <motion.button
                    type="button"
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{ once: true }}
                    whileHover={{
                      y: -8,
                      rotateX: 2,
                      rotateY: -2,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 18,
                    }}
                    onClick={() => setSelectedItem({ kind: "project", index })}
                    className="group text-left theme-surface-strong p-5 rounded-2xl hover:border-[rgba(244,184,96,0.3)] hover:bg-white/4 transition-all h-full cursor-pointer border border-white/10"
                  >
                    <motion.div
                      whileHover={{
                        scale: 1.12,
                        rotate: 4,
                      }}
                      className="w-11 h-11 theme-surface-soft rounded-xl flex items-center justify-center mb-5"
                    >
                      {project.icon}
                    </motion.div>

                    <h4 className="text-lg font-bold text-white mb-3">
                      {project.title}
                    </h4>

                    <p className="text-sm text-(--theme-text-muted) leading-relaxed">
                      {project.description}
                    </p>
                    <div className="mt-5 text-[0.68rem] uppercase tracking-[0.24em] text-amber-300 font-semibold">
                      Open details
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <Modal
            open={selectedItem !== null}
            title={activeExperience?.role ?? activeProject?.title ?? ""}
            subtitle={
              activeExperience
                ? `${activeExperience.company} • ${activeExperience.period}`
                : activeProject
                  ? "Key Highlight"
                  : undefined
            }
            onClose={() => setSelectedItem(null)}
          >
            {activeExperience ? (
              <div className="space-y-6">
                <div className="rounded-2xl theme-surface-soft p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-amber-300 font-semibold mb-2">
                    Summary
                  </p>
                  <p className="text-sm text-(--theme-text-soft) leading-relaxed">
                    {activeExperience.description}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-(--theme-text-muted) font-medium mb-3">
                    Highlights
                  </p>
                  <div className="space-y-3">
                    {activeExperience.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 rounded-xl theme-surface-soft px-3 py-2.5"
                      >
                        <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-(--theme-text-muted) leading-relaxed">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-(--theme-text-muted) font-medium mb-3">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeExperience.tech.map((tech) => (
                      <span
                        key={tech}
                        className="theme-surface-soft rounded-full px-3 py-1.5 text-xs font-medium text-(--theme-text-soft)"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {activeProject ? (
              <div className="space-y-6">
                <div className="rounded-2xl theme-surface-soft p-4 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl theme-surface flex items-center justify-center shrink-0">
                    {activeProject.icon}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-amber-300 font-semibold mb-2">
                      Overview
                    </p>
                    <p className="text-sm text-(--theme-text-soft) leading-relaxed">
                      {activeProject.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </Modal>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-3 pt-8"
        >
          <div className="max-w-4xl mx-auto">
            <ContactForm />
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/15 bg-black/10 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-(--theme-text-muted)">
          <p>
            © {new Date().getFullYear()} Chinmai D Bharadwaj. All rights
            reserved.
          </p>

          <div className="flex items-center gap-6">
            <motion.a
              whileHover={{
                y: -2,
                scale: 1.04,
              }}
              href="https://github.com/whiteblizzard9248"
              className="hover:text-amber-400 transition-colors"
            >
              WhiteBlizzard
            </motion.a>

            <motion.a
              whileHover={{
                y: -2,
                scale: 1.04,
              }}
              href="https://github.com/chinmaidb"
              className="hover:text-amber-400 transition-colors"
            >
              ChinmaiDB
            </motion.a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default App;
