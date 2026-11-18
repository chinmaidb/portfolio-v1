import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { motion, MotionConfig, useMotionValue, useReducedMotion, useSpring, type Variants } from "motion/react";
import {
  Mail,
  Phone,
  GitFork,
  MapPin,
  Briefcase,
  GraduationCap,
  BookOpen,
  ChevronRight,
  Terminal,
  Database,
  FileText,
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
      staggerChildren: 0.08,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotate: -1.2,
  },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.95,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

type ExperienceItem = {
  icon: ReactNode;
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
  tech: string[];
};

const projectCardVariants: Variants = {
  rest: { opacity: 0, y: 38, rotate: -1.5 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
  hover: {
    opacity: 1,
    y: -5,
    scale: 1.03,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
};

const projectStickerVariants: Variants = {
  rest: { opacity: 0, scale: 0.55, rotate: 18 },
  show: { opacity: 0, scale: 0.55, rotate: 18 },
  hover: {
    opacity: 1,
    scale: 1,
    rotate: -9,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
};

function ProjectCard({
  project,
  index,
  reduceMotion,
  onOpen,
}: {
  project: ProjectItem;
  index: number;
  reduceMotion: boolean;
  onOpen: () => void;
}) {
  const variants: Variants = {
    ...projectCardVariants,
    show: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { duration: 0.95, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] },
    },
  };
  const pointerFrame = useRef<number | null>(null);
  const point = useRef({ x: 0, y: 0 });
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 260, damping: 18, mass: 0.65 });
  const rotateY = useSpring(rawY, { stiffness: 260, damping: 18, mass: 0.65 });

  useEffect(() => () => {
    if (pointerFrame.current !== null) cancelAnimationFrame(pointerFrame.current);
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    point.current = {
      x: (event.clientX - bounds.left) / bounds.width - 0.5,
      y: (event.clientY - bounds.top) / bounds.height - 0.5,
    };
    if (pointerFrame.current !== null) return;
    const card = event.currentTarget;
    pointerFrame.current = requestAnimationFrame(() => {
      rawX.set(-point.current.y * 12);
      rawY.set(point.current.x * 12);
      card.style.setProperty("--spot-x", `${(point.current.x + 0.5) * 100}%`);
      card.style.setProperty("--spot-y", `${(point.current.y + 0.5) * 100}%`);
      pointerFrame.current = null;
    });
  };

  const resetPointer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (pointerFrame.current !== null) cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = null;
    rawX.set(0);
    rawY.set(0);
    event.currentTarget.style.setProperty("--spot-x", "50%");
    event.currentTarget.style.setProperty("--spot-y", "50%");
  };

  return (
    <motion.button
      type="button"
      initial="rest"
      whileInView="show"
      whileHover={reduceMotion ? undefined : "hover"}
      whileFocus={reduceMotion ? undefined : "hover"}
      viewport={{ once: true, amount: 0.15 }}
      variants={variants}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`View ${project.title} project details`}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="project-card group text-left theme-surface-strong relative h-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 p-5"
    >
      <motion.span aria-hidden="true" variants={projectStickerVariants} className="project-peek">VIEW <ChevronRight size={13} /></motion.span>
      <motion.div className="project-icon w-11 h-11 theme-surface-soft mb-5 flex items-center justify-center rounded-xl">
        {project.icon}
      </motion.div>
      <h4 className="mb-3 text-lg font-bold text-white">{project.title}</h4>
      <p className="text-sm leading-relaxed text-(--theme-text-muted)">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.slice(0, 3).map((tech) => (
          <span key={tech} className="theme-surface-soft rounded-full px-2.5 py-1 text-[0.62rem] font-semibold text-(--theme-text-muted)">{tech}</span>
        ))}
      </div>
      <div className="project-open mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-amber-300">Open details</div>
    </motion.button>
  );
}

const App = () => {
  const reduceMotion = useReducedMotion();
  const [selectedItem, setSelectedItem] = useState<
    | { kind: "experience"; index: number }
    | { kind: "project"; index: number }
    | null
  >(null);
  const storyRegionRef = useRef<HTMLDivElement | null>(null);
  const storyViewportRef = useRef<HTMLDivElement | null>(null);
  const storyTrackRef = useRef<HTMLDivElement | null>(null);

  const skills = {
    backend: [
      "Java (8,11,17,21)",
      "Spring Boot Ecosystem",
      "Rust",
      "Golang",
      ".NET 10 / C#",
      "PHP / Laravel",
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
      "React",
      "Blazor",
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
      icon: <Rocket aria-hidden="true" size={18} />,
      role: "Entrepreneur / Co-founder",
      company: "ShreshtaSMG",
      period: "June 2025 - Present",
      description:
        "Building custom desktop and web software for finance, operations, inventory, document workflows, and customer benefit programs.",
      highlights: [
        "Built a Rust desktop accounting ERP for stock and inventory, sales and purchase invoicing, GST-compliant vouchers, scheduled backups, optional AWS uploads, and pharma workflows.",
        "Developed a web ERP with Go and React for inventory, sales and purchase invoicing, receipt and payment vouchers, GST compliance, and scheduled backups with optional AWS uploads.",
        "Created a desktop document client for configured-folder sync and ad-hoc uploads to selected local or cloud destinations, with scheduled AWS S3 backup uploads.",
        "Built desktop and web clients to manage asymmetric keys and distribute keys between client applications.",
        "Built a financial analytics platform that turns uploaded source files into PostgreSQL-backed dashboards and supports contextual questions across the data.",
        "Created choultry booking and administration workflows for staff, with accounting vouchers and an external Aadhaar processing integration.",
        "Developed a benefit-scheme platform for promoters and customers to schedule payments, record lottery draws, and manage receipt and payment vouchers.",
        "Developed a CRM application using Golang, SQLite, and Svelte.",
        "Built a domain-specific Chatbot integrating open-source LLMs to generate image captions.",
        "Developed cloud-based accounting and invoicing software utilizing Python and MariaDB.",
        "Created an automated backup management system for AWS S3 using a Golang/MariaDB backend and terminal client.",
        "Implemented e-commerce plugins for GST handling and custom QR code payments.",
        "Built high-performance APIs with FastAPI and customized enterprise workflows using Frappe ERPNext.",
      ],
      tech: [
        "Rust",
        "Golang",
        "React",
        ".NET 10",
        "Blazor",
        "Laravel",
        "Python",
        "PostgreSQL",
        "FastAPI",
        "Echo",
        "Frappe ERPNext",
        "Svelte",
        "MariaDB",
        "LLMs",
        "AWS S3",
        "Asymmetric cryptography",
      ],
    },
    {
      icon: <Briefcase aria-hidden="true" size={18} />,
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
      icon: <Terminal aria-hidden="true" size={18} />,
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
      icon: <Cpu aria-hidden="true" size={18} />,
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
      title: "Rust Accounting ERP · Desktop",
      description:
        "A desktop ERP for stock and inventory, sales and purchase invoicing, and receipt and payment vouchers with GST compliance. Additional modules handle scheduled backups, optional AWS uploads, and pharma workflows.",
      icon: <Database className="w-6 h-6 text-amber-400" />,
      tech: ["Rust", "Desktop app", "Inventory", "GST", "AWS S3", "Pharma"],
    },
    {
      title: "Accounting ERP · Web",
      description:
        "A web ERP built with React and Go for stock and inventory, sales and purchase invoicing, receipt and payment vouchers, and GST compliance. Includes scheduled backups with optional AWS uploads.",
      icon: <Server className="w-6 h-6 text-amber-400" />,
      tech: ["React", "Golang", "Echo", "GST", "AWS S3", "Scheduler"],
    },
    {
      title: "Document Storage & Backup · Desktop",
      description:
        "A desktop document client that collects softcopies from configured folders or ad-hoc uploads and stores them at selected local or cloud destinations, including AWS S3. Configurable schedules automate backup uploads.",
      icon: <Terminal className="w-6 h-6 text-amber-400" />,
      tech: ["Desktop app", "Document management", "Local storage", "Cloud storage", "AWS S3", "Scheduler"],
    },
    {
      title: "Client Key Distribution",
      description:
        "Desktop and web clients for managing asymmetric keys and handling key distribution between client applications.",
      icon: <Cpu className="w-6 h-6 text-amber-400" />,
      tech: ["Desktop client", "Web client", "Asymmetric keys", "Key distribution"],
    },
    {
      title: "DocuSigner & Task Manager",
      description:
        "A document-signing workflow lets users upload documents, assign signing parties and role-specific permissions, and collect signatures at designated places. A connected Laravel task manager helps employees assign work and track completion, with voucher workflows integrated into DocuSigner. The signing workflow uses a Sanic API.",
      icon: <FileText className="w-6 h-6 text-amber-400" />,
      tech: ["Sanic API", "Laravel", "Document signing", "Role-based workflows", "Task management", "Voucher integration"],
    },
    {
      title: "Financial Insights Platform",
      description:
        "Transforms financial data from uploaded files into PostgreSQL-backed dashboards, with contextual questions to explore trends and relationships. Built with .NET 10 and Blazor, supported by Python Sanic APIs for data processing.",
      icon: <Database className="w-6 h-6 text-amber-400" />,
      tech: [".NET 10", "Blazor", "Python", "Sanic", "PostgreSQL"],
    },
    {
      title: "Choultry Booking & Accounts",
      description:
        "A booking and operations platform for choultry staff and administrators, with guest booking workflows, external Aadhaar processing, and accounting vouchers for receipts and payments.",
      icon: <Briefcase className="w-6 h-6 text-amber-400" />,
      tech: ["Laravel", "PostgreSQL", "Python", "FastAPI", "Aadhaar integration"],
    },
    {
      title: "Benefit Scheme Management",
      description:
        "Helps promoters and customers manage benefit schemes, schedule upcoming payments, and capture lottery draws. Includes accounting workflows for receipt and payment vouchers.",
      icon: <Globe className="w-6 h-6 text-amber-400" />,
      tech: ["React", "Golang", "Echo", "PostgreSQL", "Accounting"],
    },
    {
      title: "Prudential Core Policy System",
      description:
        "A massive scale corporate insurance platform utilizing Clean Architecture, Domain Driven Design, and DAPR sidecars for multi-region microservices.",
      icon: <Server className="w-6 h-6 text-amber-400" />,
      tech: ["Java 21", "Spring Boot", "Dapr", "Microservices"],
    },
    {
      title: "AI-Powered Business CRM",
      description:
        "A modern CRM featuring a custom LLM-based chatbot for image captioning and domain-specific query resolution, built with FastAPI and Svelte.",
      icon: <Cpu className="w-6 h-6 text-amber-400" />,
      tech: ["Golang", "FastAPI", "Svelte", "LLMs"],
    },
    {
      title: "Cloud Accounting & Invoicing",
      description:
        "Python and MariaDB based multi-tenant system handling customer-specific invoices and taxation (GST) plugins.",
      icon: <Database className="w-6 h-6 text-amber-400" />,
      tech: ["Python", "MariaDB", "GST", "Multi-tenant SaaS"],
    },
    {
      title: "High-Volume Policy Migrator",
      description:
        "Data engineering pipeline written in Python that successfully migrated over 800,000 complex insurance policies between disparate 3rd party systems.",
      icon: <Terminal className="w-6 h-6 text-amber-400" />,
      tech: ["Python", "Data Engineering", "800K+ records"],
    },
  ];

  const projectChapters = Array.from(
    { length: Math.ceil(projects.length / 3) },
    (_, index) => projects.slice(index * 3, index * 3 + 3),
  );
  const storyPanelCount = projectChapters.length + 4;

  const activeExperience =
    selectedItem?.kind === "experience" ? experience[selectedItem.index] : null;
  const activeProject =
    selectedItem?.kind === "project" ? projects[selectedItem.index] : null;

  useEffect(() => {
    const region = storyRegionRef.current;
    const viewport = storyViewportRef.current;
    const track = storyTrackRef.current;
    if (!region || !viewport || !track) return;
    let frame = 0;

    const updateStoryboard = () => {
      frame = 0;
      const compactLayout = window.matchMedia("(max-width: 760px)").matches;
      if (reduceMotion || compactLayout) {
        track.style.transform = "none";
        return;
      }
      const maxPageScroll = Math.max(1, region.offsetHeight - viewport.clientHeight);
      const pageProgress = Math.min(
        1,
        Math.max(0, -region.getBoundingClientRect().top / maxPageScroll),
      );
      const maxHorizontalTravel = Math.max(0, track.scrollWidth - viewport.clientWidth);
      track.style.transform = `translate3d(${-maxHorizontalTravel * pageProgress}px, 0, 0)`;
      viewport.style.setProperty("--story-progress", String(pageProgress));
      const panelIndex = Math.min(
        storyPanelCount - 1,
        Math.round(pageProgress * (storyPanelCount - 1)),
      );
      const counter = viewport.querySelector<HTMLElement>(".story-counter-current");
      if (counter) counter.textContent = String(panelIndex + 1).padStart(2, "0");
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateStoryboard);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(region);
    scheduleUpdate();
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduceMotion, storyPanelCount]);

  const navigateToStory = (panelIndex: number, targetId: string) => {
    if (reduceMotion || window.matchMedia("(max-width: 760px)").matches) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth" });
      return;
    }
    const region = storyRegionRef.current;
    if (!region) return;
    const start = region.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: start + panelIndex * window.innerHeight, behavior: "smooth" });
  };

  const trackShowcasePointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty("--spot-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--spot-y", `${y * 100}%`);
    event.currentTarget.style.setProperty("--tilt-x", `${(x - 0.5) * 7}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${(0.5 - y) * 6}deg`);
  };

  const resetShowcasePointer = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--spot-x", "50%");
    event.currentTarget.style.setProperty("--spot-y", "50%");
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };


  return (
    <MotionConfig reducedMotion="user">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={
        {
          "--theme-bg-start": "#f7f3ea",
          "--theme-bg-accent": "#e9e5ff",
        } as React.CSSProperties
      }
      className="theme-shell riso-print min-h-screen text-(--theme-text-soft) font-sans selection:bg-(--theme-selection) relative overflow-clip"
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={reduceMotion ? {} : {
            x: [0, 110, 0, -110, 0, 110, 0, -110, 0],
            y: [0, 60, 90, 60, 0, -60, -90, -60, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
          }}
          className="riso-ink-field riso-ink-field-blue ambient-blob ambient-blob-one top-[12%] left-[-12%] h-80 w-80"
        />

        <motion.div
          animate={reduceMotion ? {} : {
            x: [0, -120, 0, 120, 0, -120, 0, 120, 0],
            y: [0, -65, -100, -65, 0, 65, 100, 65, 0],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "linear",
          }}
          className="riso-ink-field riso-ink-field-coral ambient-blob ambient-blob-two bottom-[4%] right-[-10%] h-80 w-80"
        />

        <motion.div
          animate={reduceMotion ? {} : {
            x: [0, 75, 0, -75, 0, 75, 0, -75, 0],
            y: [0, 42, 62, 42, 0, -42, -62, -42, 0],
          }}
          transition={{ duration: 19, repeat: Infinity, ease: "linear", delay: -7 }}
          className="riso-ink-field riso-ink-field-lilac ambient-blob ambient-blob-three top-[35%] right-[18%] h-72 w-72"
        />

        <motion.div
          animate={reduceMotion ? {} : {
            x: [0, -65, 0, 65, 0, -65, 0, 65, 0],
            y: [0, -36, -54, -36, 0, 36, 54, 36, 0],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear", delay: -12 }}
          className="riso-ink-field riso-ink-field-mint ambient-blob ambient-blob-four bottom-[20%] left-[22%] h-64 w-64"
        />
      </div>

      <div ref={storyRegionRef} className="story-scroll-region relative z-10" style={{ "--story-panel-count": storyPanelCount } as React.CSSProperties}>
        <div ref={storyViewportRef} className="story-viewport">
          <div className="storyboard-chrome" aria-hidden="true">
            <div className="story-progress"><span className="story-progress-fill" /></div>
            <div className="story-counter"><span className="story-counter-current">01</span><i />{String(storyPanelCount).padStart(2, "0")}</div>
            <span className="story-scroll-hint">SCROLL TO EXPLORE <b>↔</b></span>
          </div>
          <div ref={storyTrackRef} className="story-track">
      {/* Header / Hero Section */}
      <header id="top" className="chapter-section story-panel hero-panel relative z-10 overflow-hidden border-b border-white/10 pt-5 pb-12 min-h-[88vh] flex items-center">
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
              <a href="#work" onClick={(event) => { event.preventDefault(); navigateToStory(1, "work"); }} className="nav-link">Experience</a>
              <a href="#expertise" onClick={(event) => { event.preventDefault(); navigateToStory(2 + projectChapters.length, "expertise"); }} className="nav-link">Expertise</a>
              <a href="#contact" onClick={(event) => { event.preventDefault(); navigateToStory(3 + projectChapters.length, "contact"); }} className="nav-contact">Let’s talk <ChevronRight className="h-3.5 w-3.5" /></a>
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
              <div className="hero-showcase relative min-h-[420px] overflow-hidden rounded-4xl theme-surface-strong sm:min-h-[510px]" role="img" aria-label="Illustrated software portfolio dashboard with delivery metrics, service architecture, and code panels" onPointerMove={trackShowcasePointer} onPointerLeave={resetShowcasePointer}>
                <div className="showcase-grid absolute inset-0" />
                <div className="showcase-glare absolute inset-0" />
                <div className="showcase-kicker absolute left-6 top-6"><span>Product systems</span><b>FIELD NOTE / 01</b></div>

                <motion.div
                  className="product-console-float"
                  animate={reduceMotion ? {} : { y: [0, -7, 0], rotate: [0, -0.35, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                >
                <div className="product-console">
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
                animate={reduceMotion ? {} : {
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
            <section id="work" className="story-panel story-content-panel experience-panel">
              <div className="story-panel-inner">
                <div className="story-heading-row"><div><p className="story-eyebrow">02 / THE JOURNEY</p><h2>Built through <em>experience.</em></h2></div><span className="story-side-note">12 years · 4 chapters</span></div>
                <div className="experience-story-grid">
                  {experience.map((job, index) => <motion.button key={job.company} type="button" initial={reduceMotion ? false : { opacity: 0, y: 34, rotate: -1.2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }} whileHover={reduceMotion ? undefined : { y: -5 }} onClick={() => setSelectedItem({ kind: "experience", index })} className="experience-story-card theme-surface-strong text-left rounded-3xl p-5 md:p-6">
                    <div className="flex items-center justify-between gap-3"><span className="story-card-index">{job.icon}</span><span className="story-card-period">{job.period}</span></div><h3>{job.role}</h3><p className="story-card-company">{job.company}</p><p className="story-card-summary">{job.description}</p><div className="story-card-tags">{job.tech.slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}</div><span className="story-card-action"><BookOpen size={14} aria-hidden="true" /> READ CHAPTER</span>
                  </motion.button>)}
                </div>
              </div>
            </section>
            {projectChapters.map((chapter, chapterIndex) => <section key={chapterIndex} className="story-panel story-content-panel project-chapter-panel">
              <div className="story-panel-inner"><div className="story-heading-row"><div><p className="story-eyebrow">0{chapterIndex + 3} / SELECTED WORK · {String(chapterIndex + 1).padStart(2, "0")}</p><h2>{["Systems that move business.", "Tools for people & process.", "Platforms at scale.", "And the connective tissue."][chapterIndex] ?? "Selected work."}</h2></div><span className="story-side-note">{String(chapterIndex * 3 + 1).padStart(2, "0")} — {String(Math.min(chapterIndex * 3 + 3, projects.length)).padStart(2, "0")}</span></div>
                <div className="project-story-grid">{chapter.map((project, cardIndex) => { const projectIndex = chapterIndex * 3 + cardIndex; return <ProjectCard key={project.title} project={project} index={projectIndex} reduceMotion={Boolean(reduceMotion)} onOpen={() => setSelectedItem({ kind: "project", index: projectIndex })} />; })}</div>
              </div>
            </section>)}
            <section id="expertise" className="story-panel story-content-panel expertise-panel"><div className="story-panel-inner expertise-story-layout">
              <div className="expertise-story-intro"><p className="story-eyebrow">0{projectChapters.length + 3} / THE TOOLKIT</p><h2>Curiosity, <em>made useful.</em></h2><p>From language runtimes to architecture patterns, a toolkit shaped by the problems each product needs to solve.</p><div className="education-story-card theme-surface-strong"><GraduationCap /><div><small>EDUCATION</small><strong>B.E. in Mechanical Engineering</strong><span>Government Engineering College, Hassan · Affiliated to VTU Belgaum</span></div></div></div>
              <div className="skills-story-grid">{Object.entries(skills).map(([category, items], index) => <motion.div key={category} className={`skills-story-card skills-story-card-${index} theme-surface-strong`} initial={reduceMotion ? false : { opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07, duration: 0.7 }}><span>0{index + 1} / {category}</span><div>{items.map(skill => <i key={skill}>{skill}</i>)}</div></motion.div>)}</div>
            </div></section>
            <section id="contact" className="story-panel story-content-panel contact-panel"><div className="story-panel-inner"><div className="story-heading-row"><div><p className="story-eyebrow">0{storyPanelCount} / WHAT’S NEXT?</p><h2>Have a good <em>problem?</em></h2></div><span className="story-side-note">Open to thoughtful collaborations</span></div><div className="contact-story-content"><div className="contact-story-aside"><span className="contact-orbit">LET’S BUILD<br/>SOMETHING<br/><b>USEFUL.</b></span><p>From the first sketch to the last production edge case, I enjoy making ambitious software feel dependable.</p><p className="contact-aside-note">Usually replies within 24 hours · Freelance projects · Full-time roles · Consultations · Open source</p><a className="contact-email-link" href="mailto:chinmai.bharadwaj@ymail.com"><span>chinmai.bharadwaj@ymail.com</span><Mail size={16} aria-hidden="true" /></a></div><div className="contact-story-form"><ContactForm /></div></div><footer className="story-footer"><span>© {new Date().getFullYear()} Chinmai D Bharadwaj</span><div><a href="https://github.com/whiteblizzard9248" target="_blank" rel="noreferrer">WhiteBlizzard <GitFork size={15} aria-hidden="true" /></a><a href="https://github.com/chinmaidb" target="_blank" rel="noreferrer">ChinmaiDB <GitFork size={15} aria-hidden="true" /></a></div></footer></div></section>
          </div>
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
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-(--theme-text-muted) font-medium mb-3">
                  Built with
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeProject.tech.map((tech) => (
                    <span key={tech} className="theme-surface-soft rounded-full px-3 py-1.5 text-xs font-medium text-(--theme-text-soft)">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </Modal>
        </div>
      </div>
    </motion.div>
    </MotionConfig>
  );
};

export default App;
