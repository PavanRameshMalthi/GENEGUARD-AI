import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Heart, 
  Brain, 
  Sparkles, 
  FileText, 
  Lock, 
  ClipboardList, 
  Cpu, 
  TrendingUp, 
  ChevronDown
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import DnaHelixVisual from '@/components/ui/DnaHelixVisual';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    { 
      icon: <Brain size={24} className="text-indigo-600 dark:text-indigo-400" />, 
      title: 'AI Genetic Analysis', 
      desc: 'Advanced machine learning models analyze complex genetic variants and health markers.' 
    },
    { 
      icon: <Shield size={24} className="text-indigo-600 dark:text-indigo-400" />, 
      title: 'Preventive Intelligence', 
      desc: 'Proactively identify disease predispositions and receive personalized prevention strategies.' 
    },
    { 
      icon: <Sparkles size={24} className="text-indigo-600 dark:text-indigo-400" />, 
      title: 'AI Assistant', 
      desc: 'Conversational clinical intelligence powered by Google Gemini to answer your genetic questions.' 
    },
    { 
      icon: <FileText size={24} className="text-indigo-600 dark:text-indigo-400" />, 
      title: 'Diagnostic Reports', 
      desc: 'Seamlessly upload and decode complex medical lab panels into structured actionable summaries.' 
    },
    { 
      icon: <Heart size={24} className="text-indigo-600 dark:text-indigo-400" />, 
      title: 'Personalized Lifestyle', 
      desc: 'Tailored nutrition, exercise, sleep, and hydration protocols aligned with your biometric data.' 
    },
    { 
      icon: <Lock size={24} className="text-indigo-600 dark:text-indigo-400" />, 
      title: 'Privacy & Security', 
      desc: 'HIPAA & GDPR-grade zero-knowledge data architecture with granular user export and purge controls.' 
    }
  ];

  const steps = [
    { 
      step: '01',
      icon: <ClipboardList size={24} />, 
      title: 'Complete Assessment', 
      desc: 'Share your lifestyle metrics, medical history, and hereditary factors in our intuitive questionnaire.' 
    },
    { 
      step: '02',
      icon: <Cpu size={24} />, 
      title: 'AI Synthesis', 
      desc: 'Our clinical AI engine processes your biometrics and calculates real-time longitudinal risk scores.' 
    },
    { 
      step: '03',
      icon: <TrendingUp size={24} />, 
      title: 'Proactive Action', 
      desc: 'Receive immediate recommendations, preventive timelines, and physician discussion guides.' 
    }
  ];

  const faqs = [
    { 
      q: 'Is GeneGuard AI a substitute for clinical diagnosis?', 
      a: 'No. GeneGuard AI is an educational preventive health intelligence platform. All risk scores, summaries, and suggestions should be reviewed with qualified medical professionals.' 
    },
    { 
      q: 'How is my personal health information protected?', 
      a: 'We implement industry-standard encryption, strict access controls, and give you complete data portability with one-click GDPR/HIPAA exports and selective data purges.' 
    },
    { 
      q: 'Can I upload and analyze my own lab documents?', 
      a: 'Yes. GeneGuard AI supports PDF, JPEG, and PNG medical lab files, automatically extracting biomarkers, reference ranges, and generating structured clinical summaries.' 
    },
    {
      q: 'How does the Gemini AI Assistant work with my data?',
      a: 'The AI Assistant securely references your authenticated health assessments, active goals, and lab reports in real-time to answer contextual questions without sharing your data publicly.'
    }
  ];

  return (
    <MainLayout>
      <div className="bg-[#f8fafc] dark:bg-[#080c18] min-h-screen text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* HERO SECTION (Reference Design 1) */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Headline, Copy, Actions & Social Proof */}
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={staggerContainer} 
                className="lg:col-span-7 space-y-6 text-left"
              >
                {/* Badge */}
                <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-tight shadow-sm">
                  <Sparkles size={13} className="text-indigo-500" />
                  <span>AI-Powered Genetic Insights</span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1 
                  variants={fadeUp} 
                  className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]"
                >
                  Understand your genetics. Protect your future.
                </motion.h1>

                {/* Supporting Text */}
                <motion.p 
                  variants={fadeUp} 
                  className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed"
                >
                  GeneGuard AI helps you understand your genetic information through advanced AI analysis and clear, actionable insights.
                </motion.p>

                {/* Primary & Secondary CTA Buttons */}
                <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 pt-2">
                  <Link to="/register">
                    <Button pill size="lg" className="px-7 py-3 text-sm font-bold shadow-md shadow-indigo-500/25">
                      Get Started
                    </Button>
                  </Link>
                  <a href="#features">
                    <Button variant="secondary" pill size="lg" className="px-7 py-3 text-sm font-bold">
                      Learn More
                    </Button>
                  </a>
                </motion.div>
              </motion.div>

              {/* Right Column: 3D DNA Helix Visual Graphic */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="lg:col-span-5 flex items-center justify-center relative"
              >
                <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                  <DnaHelixVisual size="lg" />
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-20 border-t border-slate-200/70 dark:border-slate-800/70 bg-white/50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeUp} 
              className="text-center max-w-3xl mx-auto mb-14"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/40">
                Core Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
                Precision Intelligence for Your Biology
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2">
                Designed to translate complex genomic and diagnostic data into actionable preventive health habits.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={staggerContainer} 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((f, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <Card glass className="p-6 h-full flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center mb-4 border border-indigo-100 dark:border-indigo-900/40">
                        {f.icon}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 border-t border-slate-200/70 dark:border-slate-800/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeUp} 
              className="text-center max-w-2xl mx-auto mb-14"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/40">
                Simple Workflow
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
                How GeneGuard AI Works
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((s, i) => (
                <motion.div 
                  key={i} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true }} 
                  variants={fadeUp}
                  className="bg-white dark:bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden"
                >
                  <span className="text-5xl font-black text-slate-100 dark:text-slate-800/50 absolute top-4 right-4 select-none pointer-events-none">
                    {s.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-5 shadow-sm shadow-indigo-500/20">
                    {s.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section id="about" className="py-20 border-t border-slate-200/70 dark:border-slate-800/70 bg-white/50 dark:bg-slate-900/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeUp} 
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <Card key={i} glass className="overflow-hidden p-0">
                  <button
                    className="w-full text-left p-5 sm:p-6 flex justify-between items-center focus:outline-none cursor-pointer"
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    aria-expanded={activeFaq === i}
                  >
                    <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transform transition-transform duration-200 ${activeFaq === i ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }} 
                        transition={{ duration: 0.2 }}
                        className="px-5 sm:px-6 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section id="pricing" className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-sm text-center relative overflow-hidden">
              <div className="relative z-10 max-w-xl mx-auto space-y-4">
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Take control of your genetic health today.
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
                  Sign up in seconds to receive AI-driven preventive insights, track your daily biomarkers, and decode medical reports.
                </p>
                <div className="pt-2 flex items-center justify-center">
                  <Link to="/register">
                    <Button pill size="lg" className="px-8 py-3.5 text-sm font-bold shadow-md shadow-indigo-500/20">
                      Get Started Free
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
