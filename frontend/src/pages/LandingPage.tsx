import React from 'react';
import { Link } from 'react-router';
import { ArrowRight, Activity, Brain, HeartPulse } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
              Predict Tomorrow's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Health, Today.
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10">
              GeneGuard AI uses advanced artificial intelligence to analyze your lifestyle, habits, and vitals to provide early insights into potential health risks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Start Health Assessment <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Powerful AI Insights</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our platform analyzes multiple data points to give you a comprehensive understanding of your wellness trajectory.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Brain className="w-8 h-8 text-primary" />}
              title="Smart Analysis"
              description="Upload your vitals and lifestyle data for a comprehensive AI-driven wellness overview."
            />
            <FeatureCard 
              icon={<Activity className="w-8 h-8 text-secondary" />}
              title="Risk Assessment"
              description="Identify potential long-term health risks early so you can take preventive action today."
            />
            <FeatureCard 
              icon={<HeartPulse className="w-8 h-8 text-rose-500" />}
              title="Personalized Plans"
              description="Receive customized diet, exercise, and lifestyle recommendations based on your profile."
            />
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-16">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-center">
            <Step number="1" title="Create Profile" desc="Enter your basic health metrics and habits." />
            <div className="hidden md:block w-16 h-px bg-gray-300 dark:bg-slate-700"></div>
            <Step number="2" title="AI Analysis" desc="Our Gemini-powered AI processes your data." />
            <div className="hidden md:block w-16 h-px bg-gray-300 dark:bg-slate-700"></div>
            <Step number="3" title="Get Insights" desc="Review your personalized wellness dashboard." />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
    <div className="bg-white dark:bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
  </div>
);

const Step = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <div className="flex flex-col items-center max-w-xs">
    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mb-4 shadow-lg shadow-primary/30">
      {number}
    </div>
    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h4>
    <p className="text-slate-600 dark:text-slate-400 text-sm">{desc}</p>
  </div>
);

export default LandingPage;
