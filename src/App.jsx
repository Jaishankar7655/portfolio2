import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ChevronDown, Mail, User, GraduationCap, Briefcase, FlaskConical, BookOpen, Award, Palette, Menu, X, Microscope, CheckCircle2, Factory } from 'lucide-react';
import Lenis from 'lenis';
import ThreeBackground from './ThreeBackground';
import { personalData } from './data';

// --- Smooth Scroll Wrapper ---
const SmoothScroll = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2, // Check this for mobile responsiveness
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};


// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};


// --- Components ---
const Section = ({ title, children, id, className = "" }) => (
  <section id={id} className={`min-h-screen flex flex-col justify-center py-16 px-4 md:px-20 relative z-10 ${className}`}>
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }} // Adjusted margin for mobile triggering
      variants={fadeInUp}
    >
      <h2 className="text-3xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-accent mb-10 md:mb-16 border-b border-white/10 pb-4 md:pb-6 inline-block tracking-tight">
        {title}
      </h2>
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        {children}
      </motion.div>
    </motion.div>
  </section>
);

const Card = ({ children, className = "" }) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(14,165,233,0.15)" }}
    className={`bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl transition-all duration-300 group ${className}`}
  >
    {children}
  </motion.div>
);

const LoadingFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center text-white bg-slate-950 z-50 font-mono text-xs md:text-sm">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      <span className="animate-pulse tracking-widest uppercase">Initializing 3D World</span>
    </div>
  </div>
);

const NavLink = ({ href, children, onClick, active }) => (
  <a
    href={href}
    onClick={onClick}
    className={`relative px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium transition-colors hover:text-white ${active ? 'text-white' : 'text-slate-400'}`}
  >
    {children}
    {active && (
      <motion.div
        layoutId="activeNav"
        className="absolute inset-0 bg-white/10 rounded-full -z-10"
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    )}
  </a>
);

const ProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent origin-left z-[60]"
      style={{ scaleX }}
    />
  );
};

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      // Updated section detection logic
      const sections = ['home', 'about', 'education', 'training', 'skills', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section === 'home' ? 'root' : section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <SmoothScroll>
      <Suspense fallback={<LoadingFallback />}>
        <div className="bg-slate-950 min-h-screen text-slate-200 overflow-x-hidden relative font-sans selection:bg-primary/30 selection:text-white max-w-[100vw]">
          <ProgressBar />
          <ThreeBackground />

          {/* Navigation */}
          <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/5 px-4 md:px-12 py-3 md:py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <a href="#" className="flex items-center gap-2 z-50">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white shadow-lg">K</div>
                <span className="font-bold text-white tracking-tight hidden sm:block">{personalData.name}</span>
              </a>

              {/* Desktop Menu */}
              <div className="hidden md:flex gap-1 lg:gap-2">
                {['Home', 'About', 'Education', 'Training', 'Skills', 'Contact'].map((item) => (
                  <NavLink
                    key={item}
                    href={item === 'Home' ? '#' : `#${item.toLowerCase()}`}
                    active={activeSection === item.toLowerCase()}
                  >
                    {item}
                  </NavLink>
                ))}
              </div>

              {/* Mobile Menu Toggle */}
              <button onClick={toggleMenu} className="md:hidden text-slate-300 hover:text-white transition-colors p-2 z-50 rounded-lg hover:bg-white/5">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-40 bg-slate-950/98 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center"
              >
                <div className="flex flex-col gap-6 text-center w-full px-8">
                  {['Home', 'About', 'Education', 'Training', 'Skills', 'Contact'].map((item, i) => (
                    <motion.a
                      key={item}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      href={item === 'Home' ? '#' : `#${item.toLowerCase()}`}
                      onClick={closeMenu}
                      className="text-2xl md:text-3xl font-light text-slate-300 hover:text-primary transition-colors py-2 border-b border-white/5"
                    >
                      {item}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hero Section */}
          <section id="home" className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 text-center pt-20 overflow-hidden">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="w-full max-w-5xl mx-auto"
            >
              <motion.div variants={scaleIn} className="mb-8 md:mb-12 relative inline-block">
                <div className="w-24 h-24 md:w-48 md:h-48 rounded-full p-[2px] bg-gradient-to-tr from-primary via-white to-accent mx-auto animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-[2px] rounded-full bg-slate-950 p-1 md:p-2 overflow-hidden">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <User size={40} className="text-slate-500/50 md:hidden" />
                    <User size={64} className="text-slate-500/50 hidden md:block" />
                  </div>
                </div>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[1.1] break-words">
                <span className="block text-slate-300">Future</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-accent block my-2">Pharmaceutical</span>
                <span className="block text-slate-300">Leader</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-base sm:text-lg md:text-2xl text-slate-400 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed font-light px-2">
                Hi, I'm <b className="text-white">{personalData.name}</b>. I bridge the gap between <span className="text-primary">academic theory</span> and <span className="text-accent">industrial application</span>.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4 w-full sm:w-auto">
                <a href="#contact" className="group w-full sm:w-auto px-8 py-3 md:px-10 md:py-4 bg-white text-slate-950 rounded-full font-bold transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-white/10">
                  Let's Talk <Mail size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#training" className="group w-full sm:w-auto px-8 py-3 md:px-10 md:py-4 bg-transparent border border-white/20 hover:border-white/50 text-white rounded-full font-bold transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
                  My Work <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
            >
              <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-slate-500 to-transparent"></div>
            </motion.div>
          </section>

          {/* About Section */}
          <Section id="about" title="Who Am I?">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <Card className="order-2 md:order-1">
                <p className="text-base md:text-lg text-slate-300 leading-relaxed font-light text-justify">
                  <span className="text-2xl md:text-3xl font-serif text-primary block mb-2 opacity-50">"</span>
                  {personalData.summary}
                  <span className="text-2xl md:text-3xl font-serif text-accent block mt-2 text-right opacity-50">"</span>
                </p>
              </Card>
              <div className="grid grid-cols-2 gap-3 md:gap-4 order-1 md:order-2">
                {[
                  { icon: Award, color: "text-yellow-500", val: "2026", label: "Graduation Year" },
                  { icon: FlaskConical, color: "text-accent", val: "3+ Years", label: "Academic Exp" },
                  { icon: Factory, color: "text-primary", val: "1 Month", label: "Industrial Training" },
                  { icon: Palette, color: "text-pink-500", val: "Creative", label: "Mindset" }
                ].map((stat, i) => (
                  <motion.div key={i} variants={fadeInUp} className="p-4 md:p-6 bg-slate-900/50 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-2 md:gap-4 hover:bg-slate-800/50 transition-colors">
                    <stat.icon size={24} className={`${stat.color} md:w-8 md:h-8`} />
                    <div>
                      <div className="text-lg md:text-2xl font-bold text-white">{stat.val}</div>
                      <div className="text-slate-500 text-xs md:text-sm">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>

          {/* Education Section */}
          <Section id="education" title="Academic Journey">
            <div className="space-y-4 md:space-y-6">
              {personalData.education.map((edu, index) => (
                <Card key={index} className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none md:hidden text-white/20">
                    <GraduationCap size={80} />
                  </div>
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-slate-800 flex items-center justify-center group-hover:bg-primary transition-colors duration-500 shadow-inner">
                      <GraduationCap className="text-white" size={24} />
                    </div>
                    {index !== personalData.education.length - 1 && (
                      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-8 md:h-12 bg-white/10" />
                    )}
                  </div>
                  <div className="flex-1 w-full relative z-10">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-1">
                      <h3 className="text-lg md:text-2xl font-bold text-white group-hover:text-primary transition-colors">{edu.degree}</h3>
                      <span className="text-accent font-mono text-xs md:text-sm bg-accent/10 px-2 py-1 rounded w-fit">{edu.year}</span>
                    </div>
                    <p className="text-slate-400 text-sm md:text-lg mb-3">{edu.institution}</p>
                    {edu.score && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs md:text-sm text-slate-300">
                        <CheckCircle2 size={14} className="text-green-500" /> Score: {edu.score}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Section>

          {/* Training Section */}
          <Section id="training" title="Industrial Experience">
            {personalData.experience.map((exp, index) => (
              <div key={index} className="space-y-6 md:space-y-8">
                <Card className="relative overflow-hidden !p-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="p-6 md:p-12 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{exp.role}</h3>
                        <div className="text-lg md:text-xl text-primary font-medium flex items-center gap-2">
                          <Factory className="w-5 h-5" /> {exp.company}
                        </div>
                      </div>
                      <span className="px-4 py-1 md:px-6 md:py-2 bg-white/10 rounded-full font-mono text-xs md:text-sm backdrop-blur-md border border-white/10 whitespace-nowrap">
                        {exp.duration}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <div className="space-y-3 md:space-y-4">
                        <h4 className="text-base md:text-lg font-semibold text-slate-200 border-b border-white/10 pb-2 flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-accent" /> Key Competencies
                        </h4>
                        <ul className="space-y-3">
                          {exp.points.slice(0, 2).map((pt, i) => (
                            <li key={i} className="flex gap-3 text-sm md:text-base text-slate-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" />
                              {pt}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3 md:space-y-4">
                        <h4 className="text-base md:text-lg font-semibold text-slate-200 border-b border-white/10 pb-2 flex items-center gap-2">
                          <Microscope size={16} className="text-primary" /> Technical Focus
                        </h4>
                        <ul className="space-y-3">
                          {exp.points.slice(2).map((pt, i) => (
                            <li key={i} className="flex gap-3 text-sm md:text-base text-slate-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" />
                              {pt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Visual Representation of Tasks */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {['HPMC Capsules', 'Gelatine Shells', 'Safety Protocols', 'Quality Assurance'].map((item, i) => (
                    <motion.div
                      key={i}
                      variants={scaleIn}
                      className="bg-slate-900/30 border border-white/5 p-3 md:p-4 rounded-xl text-center hover:bg-slate-800 transition-colors flex flex-col items-center justify-center gap-2"
                    >
                      <div className="text-accent"><CheckCircle2 size={20} /></div>
                      <div className="text-xs md:text-sm font-medium text-slate-300">{item}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </Section>

          {/* Skills Section */}
          <Section id="skills" title="Expertise & Interests">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Technical Column */}
              <Card className="lg:col-span-2">
                <h3 className="text-xl font-bold mb-6 md:mb-8 flex items-center gap-3 text-white">
                  <FlaskConical className="text-accent" /> Technical Proficiency
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                  {personalData.skills.technical.map((skill, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-center gap-4 p-3 md:p-4 bg-slate-950/50 rounded-xl border border-white/5 hover:border-primary/50 transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                        <skill.icon size={20} />
                      </div>
                      <span className="font-medium text-sm md:text-base text-slate-200">{skill.name}</span>
                    </motion.div>
                  ))}
                </div>

                <h3 className="text-xl font-bold mt-10 md:mt-12 mb-6 flex items-center gap-3 text-white">
                  <BookOpen className="text-blue-400" /> Digital Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {personalData.skills.software.map((sk, i) => (
                    <span key={i} className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-950 rounded-lg text-slate-300 text-sm border border-white/10 hover:border-blue-400/50 transition-colors cursor-default">
                      {sk.name}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Soft Skills & Interests Column */}
              <div className="space-y-6">
                <Card className="h-full">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                    <Award className="text-yellow-500" /> Soft Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {personalData.skills.soft.map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 rounded-md bg-yellow-500/5 text-yellow-200/80 border border-yellow-500/10 text-xs md:text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="my-8 h-[1px] bg-white/10" />

                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                    <Palette className="text-pink-500" /> Passions
                  </h3>
                  <div className="space-y-4">
                    {personalData.interests.map((int, i) => (
                      <div key={i} className="bg-pink-500/5 rounded-2xl p-4 md:p-6 border border-pink-500/10 hover:bg-pink-500/10 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-base md:text-lg font-bold text-white">{int.name}</h4>
                          <int.icon className="text-pink-500" size={20} />
                        </div>
                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{int.description}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </Section>

          {/* Contact Section */}
          <Section id="contact" title="Get In Touch">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-4">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  href={`mailto:${personalData.contact.email}`}
                  className="p-6 md:p-10 bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-white/5 flex flex-col items-center text-center gap-4 md:gap-6 group hover:border-primary/30 transition-all shadow-xl"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 text-primary">
                    <Mail size={24} className="md:w-8 md:h-8" />
                  </div>
                  <div>
                    <div className="text-sm md:text-lg font-semibold text-slate-500 mb-1 md:mb-2">Send an Email</div>
                    <div className="text-sm md:text-xl font-bold text-white break-all">{personalData.contact.email}</div>
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.02 }}
                  href={`tel:${personalData.contact.phone}`}
                  className="p-6 md:p-10 bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-white/5 flex flex-col items-center text-center gap-4 md:gap-6 group hover:border-accent/30 transition-all shadow-xl"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-300 text-accent">
                    <Briefcase size={24} className="md:w-8 md:h-8" />
                  </div>
                  <div>
                    <div className="text-sm md:text-lg font-semibold text-slate-500 mb-1 md:mb-2">Call Me</div>
                    <div className="text-lg md:text-2xl font-bold text-white">{personalData.contact.phone}</div>
                  </div>
                </motion.a>
              </div>

              <div className="mt-12 md:mt-20 text-center border-t border-white/5 pt-8 md:pt-10">
                <p className="text-slate-500 mb-4 text-sm md:text-base">Located in <span className="text-white">{personalData.contact.location}</span></p>
                <p className="text-slate-600 text-xs md:text-sm">© {new Date().getFullYear()} {personalData.name}. Crafted with scientific precision.</p>
              </div>
            </div>
          </Section>
        </div>
      </Suspense>
    </SmoothScroll>
  );
};

export default App;
