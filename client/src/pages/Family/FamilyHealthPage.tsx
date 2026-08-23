import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import { familyService } from '@/services/family.service';
import { FamilyMember, HereditaryRiskAnalysis } from '@/types';
import { useToast } from '@/hooks/useToast';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  Sparkles, 
  Dna, 
  AlertTriangle, 
  HeartHandshake,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const COMMON_CONDITIONS = [
  'Type 2 Diabetes',
  'Hypertension (High Blood Pressure)',
  'Coronary Artery Disease / Heart Attack',
  'Hypercholesterolemia / High LDL',
  'Colorectal Cancer',
  'Breast Cancer',
  'Alzheimer’s Disease / Dementia',
  'Rheumatoid Arthritis / Autoimmune',
  'Asthma / Chronic Allergies',
  'Chronic Kidney Disease',
  'Stroke / Vascular Disease'
];

export default function FamilyHealthPage() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [analysis, setAnalysis] = useState<HereditaryRiskAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [formRelation, setFormRelation] = useState<string>('father');
  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState<string>('');
  const [formIsLiving, setFormIsLiving] = useState(true);
  const [formConditions, setFormConditions] = useState<string[]>([]);
  const [formAgeOfOnset, setFormAgeOfOnset] = useState<string>('');
  const [formNotes, setFormNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const { success, error: showError } = useToast();

  const fetchFamilyData = async () => {
    try {
      setLoading(true);
      const [membersRes, analysisRes] = await Promise.allSettled([
        familyService.getFamilyMembers(),
        familyService.getHereditaryRiskAnalysis()
      ]);

      if (membersRes.status === 'fulfilled' && membersRes.value.data) {
        setMembers(membersRes.value.data);
      }
      if (analysisRes.status === 'fulfilled' && analysisRes.value.data) {
        setAnalysis(analysisRes.value.data);
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilyData();
  }, []);

  const openAddModal = (relation?: string) => {
    setEditingMember(null);
    setFormRelation(relation || 'father');
    setFormName('');
    setFormAge('');
    setFormIsLiving(true);
    setFormConditions([]);
    setFormAgeOfOnset('');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (member: FamilyMember) => {
    setEditingMember(member);
    setFormRelation(member.relation);
    setFormName(member.name || '');
    setFormAge(member.age ? String(member.age) : '');
    setFormIsLiving(member.isLiving);
    setFormConditions(member.conditions || []);
    setFormAgeOfOnset(member.ageOfOnset ? String(member.ageOfOnset) : '');
    setFormNotes(member.notes || '');
    setIsModalOpen(true);
  };

  const toggleCondition = (cond: string) => {
    setFormConditions(prev => 
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Partial<FamilyMember> = {
        relation: formRelation as any,
        name: formName || undefined,
        age: formAge ? Number(formAge) : undefined,
        isLiving: formIsLiving,
        conditions: formConditions,
        ageOfOnset: formAgeOfOnset ? Number(formAgeOfOnset) : undefined,
        notes: formNotes || undefined
      };

      if (editingMember) {
        await familyService.updateFamilyMember(editingMember._id, payload);
        success('Family relative record updated');
      } else {
        await familyService.addFamilyMember(payload);
        success('Family relative record added');
      }

      setIsModalOpen(false);
      fetchFamilyData();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to save family member');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!window.confirm('Delete this family health record?')) return;
    try {
      await familyService.deleteFamilyMember(id);
      success('Family member removed');
      fetchFamilyData();
    } catch {
      showError('Failed to remove family member');
    }
  };

  // Prepare Radar Chart Data from hereditary analysis
  const radarData = (analysis?.conditionPredispositions || []).map(p => ({
    subject: p.condition.split(' ')[0] + ' ' + (p.condition.split(' ')[1] || ''),
    riskScore: p.riskScore,
    fullMark: 100
  }));

  const relationSlots = [
    { key: 'paternal_grandfather', label: 'Paternal Grandfather', degree: '2nd Degree' },
    { key: 'paternal_grandmother', label: 'Paternal Grandmother', degree: '2nd Degree' },
    { key: 'maternal_grandfather', label: 'Maternal Grandfather', degree: '2nd Degree' },
    { key: 'maternal_grandmother', label: 'Maternal Grandmother', degree: '2nd Degree' },
    { key: 'father', label: 'Father', degree: '1st Degree' },
    { key: 'mother', label: 'Mother', degree: '1st Degree' },
    { key: 'brother', label: 'Brother', degree: '1st Degree' },
    { key: 'sister', label: 'Sister', degree: '1st Degree' },
    { key: 'son', label: 'Son', degree: '1st Degree' },
    { key: 'daughter', label: 'Daughter', degree: '1st Degree' }
  ];

  return (
    <DashboardLayout title="Family Health Factors">
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Dna size={14} /> Hereditary Risk Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Family Health & Pedigree Factors
            </h1>
          </div>

          <Button onClick={() => openAddModal()} icon={<Plus size={15} />}>
            Add Family Relative
          </Button>
        </div>

        <DisclaimerBanner />

        {/* Top Summary Banner & Risk Radar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Overall Genetic Risk Score */}
          <Card glass className="p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Aggregated Familial Risk Score
              </span>
              <div className="flex items-baseline gap-3 my-2">
                <span className="text-4xl font-black text-gray-900 dark:text-white">
                  {analysis?.overallRiskScore ?? 45}
                </span>
                <span className="text-sm font-semibold text-gray-400">/ 100</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ml-auto ${
                  (analysis?.overallRiskScore || 45) < 40 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : (analysis?.overallRiskScore || 45) < 70
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                }`}>
                  {analysis?.riskCategory || 'Moderate'} Risk
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
                {analysis?.summary || '1st and 2nd degree relatives share key genetic predispositions. Proactive screening and whole-food nutrition provide actionable risk mitigation.'}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary-500" />
              <span>{members.length} relatives tracked in pedigree tree</span>
            </div>
          </Card>

          {/* Right: Hereditary Risk Radar Chart */}
          <Card glass className="col-span-1 lg:col-span-2 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2 flex items-center gap-2">
              <Activity size={18} className="text-primary-500" /> Hereditary Disease Predisposition Radar
            </h3>
            {radarData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#94a3b8" strokeDasharray="3 3" opacity={0.3} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Tooltip />
                    <Radar name="Genetic Risk Score" dataKey="riskScore" stroke="#0284c7" fill="#0284c7" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-xs text-gray-400 text-center">
                Add relatives with diagnosed conditions to generate your personalized hereditary risk radar.
              </div>
            )}
          </Card>
        </div>

        {/* Interactive Pedigree Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users size={18} className="text-primary-500" /> Family Health Pedigree Records
            </h2>
            <span className="text-xs text-gray-400">1st & 2nd Degree Lineage</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relationSlots.map(slot => {
              const matched = members.filter(m => m.relation === slot.key);

              if (matched.length === 0) {
                return (
                  <div
                    key={slot.key}
                    onClick={() => openAddModal(slot.key)}
                    className="p-5 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/30 dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-2 group min-h-[140px]"
                  >
                    <div className="p-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-primary-500 transition-colors">
                      <Plus size={18} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                        {slot.label}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {slot.degree} • Click to add record
                      </span>
                    </div>
                  </div>
                );
              }

              return matched.map(m => (
                <Card key={m._id} glass className="p-5 flex flex-col justify-between transition-all hover:shadow-md">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider block">
                          {slot.degree}
                        </span>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base">
                          {m.name || slot.label}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {slot.label} {m.age ? `• ${m.age} yrs` : ''} {m.isLiving ? '(Living)' : '(Deceased)'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(m)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(m._id)}
                          className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Conditions Tags */}
                    <div className="my-3 space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                        Diagnosed Conditions:
                      </span>
                      {m.conditions && m.conditions.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {m.conditions.map((c, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-[11px] font-semibold border border-rose-200/50">
                              {c}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 size={13} /> No hereditary diseases reported
                        </span>
                      )}
                    </div>
                  </div>

                  {m.notes && (
                    <div className="text-[11px] text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800 line-clamp-2">
                      {m.notes}
                    </div>
                  )}
                </Card>
              ));
            })}
          </div>
        </div>

        {/* AI Action Plan & Preventive Guidelines */}
        {analysis?.conditionPredispositions && analysis.conditionPredispositions.length > 0 && (
          <Card glass className="p-6 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-950/20 border-primary-100 dark:border-primary-900/40">
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm mb-4">
              <Sparkles size={18} /> AI-Recommended Prevention Protocol for Hereditary Risks
            </div>

            <div className="space-y-4">
              {analysis.conditionPredispositions.map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                      {item.condition}
                    </h4>
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                      Predisposition: {item.riskLevel} ({item.riskScore}/100)
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>Screening Benchmark:</strong> {item.screeningBenchmarks}
                  </div>

                  <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300 pt-1">
                    {item.preventiveGuidelines.map((g, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Relative Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingMember ? 'Edit Relative Health Record' : 'Add Family Health Record'}
              </h3>

              <form onSubmit={handleSaveMember} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Relation *</label>
                    <select
                      value={formRelation}
                      onChange={(e) => setFormRelation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                    >
                      <option value="father">Father (1st Degree)</option>
                      <option value="mother">Mother (1st Degree)</option>
                      <option value="paternal_grandfather">Paternal Grandfather (2nd Degree)</option>
                      <option value="paternal_grandmother">Paternal Grandmother (2nd Degree)</option>
                      <option value="maternal_grandfather">Maternal Grandfather (2nd Degree)</option>
                      <option value="maternal_grandmother">Maternal Grandmother (2nd Degree)</option>
                      <option value="brother">Brother (1st Degree)</option>
                      <option value="sister">Sister (1st Degree)</option>
                      <option value="son">Son (1st Degree)</option>
                      <option value="daughter">Daughter (1st Degree)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Age</label>
                    <input
                      type="number"
                      placeholder="Age in years"
                      value={formAge}
                      onChange={(e) => setFormAge(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Living Status</label>
                    <select
                      value={formIsLiving ? 'true' : 'false'}
                      onChange={(e) => setFormIsLiving(e.target.value === 'true')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                    >
                      <option value="true">Living</option>
                      <option value="false">Deceased</option>
                    </select>
                  </div>
                </div>

                {/* Common Conditions Checkboxes */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Known Diagnosed Conditions
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {COMMON_CONDITIONS.map((cond) => {
                      const selected = formConditions.includes(cond);
                      return (
                        <button
                          type="button"
                          key={cond}
                          onClick={() => toggleCondition(cond)}
                          className={`p-2 rounded-xl text-left text-xs font-medium border transition-all flex items-center justify-between ${
                            selected
                              ? 'bg-primary-50 dark:bg-primary-950/50 border-primary-500 text-primary-700 dark:text-primary-300'
                              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <span className="truncate">{cond}</span>
                          {selected && <CheckCircle2 size={14} className="text-primary-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Clinical Notes (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Diagnosed in early 40s, managed with medication"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
                  <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={saving}>
                    Save Record
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
