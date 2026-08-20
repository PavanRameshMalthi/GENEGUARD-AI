import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Heart, Activity, Brain, MessageSquare, FileText, Lock, ClipboardList, Cpu, TrendingUp, ChevronDown } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { APP_NAME } from '@/utils/constants';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    { icon: <Brain size={32} className="text-primary-500" />, title: 'AI Health Analysis', desc: 'Advanced algorithms analyze your health data.' },
    { icon: <Shield size={32} className="text-primary-500" />, title: 'Preventive Insights', desc: 'Catch potential health issues before they become serious.' },
    { icon: <MessageSquare size={32} className="text-primary-500" />, title: 'Health Chatbot', desc: '24/7 AI assistant for your health-related queries.' },
    { icon: <FileText size={32} className="text-primary-500" />, title: 'Medical Reports', desc: 'Upload and simplify complex medical reports.' },
    { icon: <Heart size={32} className="text-primary-500" />, title: 'Personalized Plans', desc: 'Custom diet and exercise recommendations.' },
    { icon: <Lock size={32} className="text-primary-500" />, title: 'Data Security', desc: 'Your health data is encrypted and strictly private.' }
  ];

  const steps = [
    { icon: <ClipboardList size={32} />, title: 'Complete Assessment', desc: 'Answer a few questions about your lifestyle.' },
    { icon: <Cpu size={32} />, title: 'AI Analysis', desc: 'Our AI engine processes your inputs securely.' },
    { icon: <TrendingUp size={32} />, title: 'Get Insights', desc: 'Receive actionable recommendations immediately.' }
  ];

  const faqs = [
    { q: 'Is GeneGuard AI a replacement for my doctor?', a: 'No, it provides educational insights. Always consult a healthcare professional for medical advice.' },
    { q: 'How is my data protected?', a: 'We use military-grade encryption. Your data is never sold to third parties.' },
    { q: 'Can I upload my own lab reports?', a: 'Yes! Our AI can analyze and simplify complex medical jargon for you.' }
  ];

  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100">
        <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-primary-500/10 to-transparent">
          <div className="container mx-auto px-6">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center max-w-4xl mx-auto">
              <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white">
                {APP_NAME}
              </motion.h1>
              <motion.p variants={fadeUp} className="text-xl md:text-2xl mb-4 text-primary-600 dark:text-primary-400 font-medium">
                Predict Tomorrow's Health, Today.
              </motion.p>
              <motion.p variants={fadeUp} className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                AI-powered preventive healthcare platform that turns your lifestyle data and medical reports into actionable, personalized wellness plans.
              </motion.p>
              <motion.div variants={fadeUp} className="flex justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="px-8 py-4 text-lg">Start Assessment</Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg">Learn More</Button>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-24 container mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose GeneGuard AI?</h2>
            <p className="text-gray-600 dark:text-gray-400">Cutting-edge features designed for your proactive health management.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card glass hover className="p-8 h-full">
                  <div className="bg-primary-100 dark:bg-primary-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="py-24 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
          <div className="container mx-auto px-6">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl font-bold text-center mb-16">
              How It Works
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-12 relative">
              {steps.map((s, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-primary-600 text-white flex items-center justify-center mb-6 text-3xl shadow-lg">
                    {s.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Step {i + 1}: {s.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 container mx-auto px-6 max-w-3xl">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} glass className="overflow-hidden">
                <button
                  className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  <span className="font-medium text-lg">{faq.q}</span>
                  <ChevronDown className={`transform transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6 text-gray-600 dark:text-gray-400">
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
