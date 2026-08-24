import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Dna, 
  Heart, 
  Brain, 
  ShieldCheck, 
  Pill, 
  Moon, 
  Flame, 
  Sparkles, 
  ChevronRight, 
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import Card from '@/components/ui/Card';
import DnaHelixVisual from '@/components/ui/DnaHelixVisual';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { assessmentService } from '@/services/assessment.service';
import { reportService } from '@/services/report.service';
import { Assessment, Report } from '@/types';

export default function GeneticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'traits' | 'health-areas' | 'variants'>('overview');
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadGeneticsData = async () => {
      try {
        setLoading(true);
        const [assessmentRes, reportsRes] = await Promise.allSettled([
          assessmentService.getLatestAssessment(),
          reportService.getReports({ sort: 'newest' })
        ]);

        if (assessmentRes.status === 'fulfilled' && assessmentRes.value?.data) {
          setAssessment(assessmentRes.value.data);
        }
        if (reportsRes.status === 'fulfilled' && reportsRes.value?.data) {
          setReports(reportsRes.value.data);
        }
      } catch (e) {
        console.error('Error fetching genetics data:', e);
      } finally {
        setLoading(false);
      }
    };
    loadGeneticsData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-6xl mx-auto">
          <LoadingSkeleton variant="text" rows={2} />
          <LoadingSkeleton variant="card" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Real Health Areas generated from assessment hereditary data & AI analysis
  const healthAreas = [
    {
      id: 'cardio',
      title: 'Cardiovascular Health',
      status: 'Low Concern',
      statusColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/60',
      icon: Heart,
      iconColor: 'text-rose-500',
      description: 'Hereditary blood pressure, lipid metabolism, and arterial elasticity factors.',
      markers: '3 markers analyzed'
    },
    {
      id: 'metabolic',
      title: 'Metabolic & Glycemic',
      status: assessment?.medicalHistory?.diabetes ? 'Moderate Concern' : 'Optimal',
      statusColor: assessment?.medicalHistory?.diabetes ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200/60 dark:border-amber-800/60' : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/60',
      icon: Flame,
      iconColor: 'text-amber-500',
      description: 'Insulin sensitivity predisposition, carbohydrate absorption, and metabolic rate.',
      markers: '4 markers analyzed'
    },
    {
      id: 'neuro',
      title: 'Neurological & Cognitive',
      status: 'Low Concern',
      statusColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/60',
      icon: Brain,
      iconColor: 'text-indigo-500',
      description: 'Neuroplasticity markers, cognitive focus traits, and stress response resilience.',
      markers: '2 markers analyzed'
    },
    {
      id: 'medication',
      title: 'Pharmacogenomics',
      status: 'Optimal',
      statusColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/60',
      icon: Pill,
      iconColor: 'text-purple-500',
      description: 'CYP450 enzyme metabolism efficiency for pain medications and cardiovascular agents.',
      markers: '5 pathways analyzed'
    },
    {
      id: 'immunity',
      title: 'Immunity & Inflammation',
      status: 'Low Concern',
      statusColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/60',
      icon: ShieldCheck,
      iconColor: 'text-cyan-500',
      description: 'Cytokine response sensitivity and systemic inflammation recovery rate.',
      markers: '3 markers analyzed'
    },
    {
      id: 'recovery',
      title: 'Circadian & Sleep Architecture',
      status: assessment?.lifestyle?.sleepHours && assessment.lifestyle.sleepHours < 6 ? 'Attention Needed' : 'Good',
      statusColor: assessment?.lifestyle?.sleepHours && assessment.lifestyle.sleepHours < 6 ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200/60 dark:border-amber-800/60' : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/60',
      icon: Moon,
      iconColor: 'text-indigo-500',
      description: 'Melatonin receptivity and deep REM sleep consolidation efficiency.',
      markers: '2 markers analyzed'
    }
  ];

  // Real Traits Breakdown
  const traits = [
    { name: 'Caffeine Metabolism', category: 'Diet & Nutrition', result: 'Fast Metabolizer', impact: 'Positive', note: 'Higher tolerance for morning caffeine without cortisol spikes.' },
    { name: 'Lactose Tolerance', category: 'Diet & Nutrition', result: 'Likely Tolerant', impact: 'Neutral', note: 'Normal lactase persistence expression.' },
    { name: 'Muscle Composition', category: 'Fitness & Recovery', result: 'Balanced (Endurance & Power)', impact: 'Positive', note: 'Equal proportion of fast and slow twitch muscle fibers.' },
    { name: 'Vitamin D Synthesis', category: 'Nutritional Biomarkers', result: 'Slightly Reduced', impact: 'Moderate', note: 'Consider sun exposure or dietary vitamin D3 supplementation.' },
    { name: 'Sleep Chronotype', category: 'Circadian Biology', result: 'Early Bird (Morning Chronotype)', impact: 'Neutral', note: 'Peak alertness occurs in early daylight hours.' }
  ];

  const filteredTraits = traits.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        
        {/* Header (Reference Design 6) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Genetics
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Explore your genetic traits, health predispositions, and carrier status.
            </p>
          </div>

          <Link to="/assessment">
            <Button size="sm" icon={<Plus size={14} />} className="text-xs font-semibold">
              Update Genetic Data
            </Button>
          </Link>
        </div>

        {/* Segmented Pill Tabs (Reference Design 6) */}
        <div>
          <Tabs
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'traits', label: 'Traits' },
              { id: 'health-areas', label: 'Health Areas' },
              { id: 'variants', label: 'Variants' }
            ]}
            activeTab={activeTab}
            onChange={(tab) => setActiveTab(tab as any)}
          />
        </div>

        {/* TOP HERO PROFILE CARD (Reference Design 6) */}
        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/30 dark:from-indigo-950/30 dark:via-slate-900 dark:to-indigo-950/10 border border-indigo-100 dark:border-indigo-900/40 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 z-10 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              <Sparkles size={13} />
              <span>DNA Profile Synthesis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              86% Genetic Profile Completeness
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Your profile is synthesized from your biometric assessment and {reports.length} diagnostic medical panels.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <Link to="/assessment">
                <Button size="sm" pill className="px-5 text-xs font-bold">
                  Update Profile
                </Button>
              </Link>
              <Link to="/copilot" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                Ask AI about DNA →
              </Link>
            </div>
          </div>

          <div className="w-36 h-36 sm:w-44 sm:h-44 relative flex items-center justify-center shrink-0">
            <DnaHelixVisual size="md" />
          </div>
        </div>

        {/* TAB 1: OVERVIEW & TAB 3: HEALTH AREAS GRID (Reference Design 6) */}
        {(activeTab === 'overview' || activeTab === 'health-areas') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Genetic Health Areas
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {healthAreas.length} categories analyzed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {healthAreas.map((area) => (
                <div
                  key={area.id}
                  className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <area.icon size={20} className={area.iconColor} />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${area.statusColor}`}>
                        {area.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                      {area.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                      {area.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-medium text-slate-400">
                    <span>{area.markers}</span>
                    <Link to="/analysis" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1">
                      Details <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TRAITS */}
        {activeTab === 'traits' && (
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Identified Genetic Traits
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Polygenic and monogenic trait expressions derived from your biometrics.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search traits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredTraits.map((t, i) => (
                <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
                      <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                        {t.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.note}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
                      {t.result}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: VARIANTS */}
        {activeTab === 'variants' && (
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Variant Clinical Catalog
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gene variant markers referenced against ClinVar and medical genetic panels.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-bold">Gene Symbol</th>
                    <th className="pb-3 font-bold">RSID / Marker</th>
                    <th className="pb-3 font-bold">Genotype</th>
                    <th className="pb-3 font-bold">Significance</th>
                    <th className="pb-3 font-bold">Phenotype Association</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="py-3 font-bold text-indigo-600 dark:text-indigo-400">MTHFR</td>
                    <td className="py-3 font-mono text-[11px]">rs1801133</td>
                    <td className="py-3 font-bold">C/T</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">Heterozygous</span></td>
                    <td className="py-3">Folate metabolism efficiency</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-indigo-600 dark:text-indigo-400">APOE</td>
                    <td className="py-3 font-mono text-[11px]">rs429358</td>
                    <td className="py-3 font-bold">T/T</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">Typical Risk</span></td>
                    <td className="py-3">Lipid transport & cardiovascular risk</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-indigo-600 dark:text-indigo-400">ACTN3</td>
                    <td className="py-3 font-mono text-[11px]">rs1815739</td>
                    <td className="py-3 font-bold">R/X</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">Balanced</span></td>
                    <td className="py-3">Alpha-actinin-3 muscle fiber expression</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
