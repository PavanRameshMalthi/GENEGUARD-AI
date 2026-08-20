import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Twitter, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-primary-500" />
              <span className="font-bold text-lg text-gray-900 dark:text-white">GeneGuard AI</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Advanced genetic analysis and personalized health recommendations powered by AI.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">About</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">Company</Link></li>
              <li><Link to="/science" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">Our Science</Link></li>
              <li><Link to="/team" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">Team</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">Dashboard</Link></li>
              <li><Link to="/assessment" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">Assessment</Link></li>
              <li><Link to="/pricing" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">Terms of Service</Link></li>
              <li><Link to="/hipaa" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">HIPAA Compliance</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} GeneGuard AI. All rights reserved.
          </p>
          <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
            Disclaimer: GeneGuard AI provides informational health insights and is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
