import React, { useState } from 'react';
import { PageType, AnalysisRecord } from '../types';
import {
  Search,
  Filter,
  Plus,
  FileText,
  Trash2,
  ExternalLink,
  Calendar,
  Building2,
  RefreshCw,
  CheckCircle2,
  Loader2,
  Download,
  AlertCircle
} from 'lucide-react';

interface AnalysisHistoryPageProps {
  onNavigate: (page: PageType) => void;
  records: AnalysisRecord[];
  onSelectRecord: (record: AnalysisRecord) => void;
  onDeleteRecord: (id: string) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const AnalysisHistoryPage: React.FC<AnalysisHistoryPageProps> = ({
  onNavigate,
  records,
  onSelectRecord,
  onDeleteRecord,
  isLoading = false,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'moderate' | 'low'>('all');
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState<string | null>(null);

  const handleDelete = async (id: string, candidateName: string) => {
    onDeleteRecord(id);
    setDeleteSuccessMsg(`Analysis record for "${candidateName}" removed successfully.`);
    setTimeout(() => setDeleteSuccessMsg(null), 3000);
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      (r.candidateName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.fileName || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (scoreFilter === 'high') return r.matchScore >= 80;
    if (scoreFilter === 'moderate') return r.matchScore >= 70 && r.matchScore < 80;
    if (scoreFilter === 'low') return r.matchScore < 70;

    return true;
  });

  const avgScore = Math.round(
    records.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / (records.length || 1)
  );

  return (
    <div className="py-6 sm:py-10 px-3 sm:px-6 max-w-[1280px] mx-auto w-full space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-3xl font-bold text-white">Analysis History</h1>
            {onRefresh && (
              <button
                onClick={onRefresh}
                title="Refresh from database"
                className="p-1.5 text-white/50 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-white/60 mt-0.5">
            Real MongoDB evaluation records, candidate scores, and ATS match history.
          </p>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-indigo-500 transition-colors shadow-md cursor-pointer min-h-[42px]"
        >
          <Plus className="w-4 h-4" />
          <span>New Resume Analysis</span>
        </button>
      </div>

      {/* Delete Success Alert Banner */}
      {deleteSuccessMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-300 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{deleteSuccessMsg}</span>
          </div>
          <button
            onClick={() => setDeleteSuccessMsg(null)}
            className="text-emerald-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-[#111111] border border-white/10 p-4 sm:p-5 rounded-xl flex items-center gap-4 shadow-md">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl shrink-0">
            {records.length}
          </div>
          <div>
            <div className="text-[10px] sm:text-xs font-semibold text-white/50 uppercase tracking-wider">Total Evaluations</div>
            <div className="text-lg sm:text-xl font-bold text-white">{records.length} Records Stored</div>
          </div>
        </div>

        <div className="bg-[#111111] border border-white/10 p-4 sm:p-5 rounded-xl flex items-center gap-4 shadow-md">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl shrink-0">
            {avgScore}%
          </div>
          <div>
            <div className="text-[10px] sm:text-xs font-semibold text-white/50 uppercase tracking-wider">Average Fit Score</div>
            <div className="text-lg sm:text-xl font-bold text-white">Overall Match Average</div>
          </div>
        </div>

        <div className="bg-[#111111] border border-white/10 p-4 sm:p-5 rounded-xl flex items-center gap-4 shadow-md">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl shrink-0">
            {records.filter((r) => r.matchScore >= 80).length}
          </div>
          <div>
            <div className="text-[10px] sm:text-xs font-semibold text-white/50 uppercase tracking-wider">High Fits (80%+)</div>
            <div className="text-lg sm:text-xl font-bold text-white">Qualified Candidates</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111111] border border-white/10 rounded-xl p-3.5 sm:p-4 shadow-md flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="relative w-full sm:w-80 md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate, role, or company..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-white/40 shrink-0" />
          <span className="text-xs font-semibold text-white/60 uppercase shrink-0">Score Range:</span>
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer min-h-[40px]"
          >
            <option value="all">All Match Scores</option>
            <option value="high">High Match (80%+)</option>
            <option value="moderate">Moderate Match (70-79%)</option>
            <option value="low">Low Match (&lt;70%)</option>
          </select>
        </div>
      </div>

      {/* Records Section: Loading, Empty, Desktop Table, & Mobile Cards */}
      <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
            <p className="text-sm text-indigo-300 font-mono">Fetching evaluations from MongoDB backend...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-8 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-white/30">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">No analysis records found</h3>
              <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-md mx-auto">
                {searchTerm || scoreFilter !== 'all'
                  ? 'No evaluation records match your search parameters. Try adjusting your filters.'
                  : 'Get started by running your first AI resume analysis against a job description.'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" /> Start First Resume Analysis
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Cards (< 768px) */}
            <div className="block md:hidden divide-y divide-white/10">
              {filteredRecords.map((record) => (
                <div key={record.id} className="p-4 space-y-3 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-bold text-base text-white">{record.candidateName}</div>
                      <div className="text-xs text-indigo-300 font-mono flex items-center gap-1 mt-0.5 break-all">
                        <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> {record.fileName}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold shrink-0 ${
                        record.matchScore >= 80
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : record.matchScore >= 70
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        record.matchScore >= 80 ? 'bg-emerald-400' : record.matchScore >= 70 ? 'bg-amber-400' : 'bg-rose-400'
                      }`}></span>
                      {record.matchScore}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/60 pt-1 border-t border-white/5">
                    <div className="space-y-0.5">
                      <div className="font-medium text-white/90">{record.jobTitle}</div>
                      <div className="text-white/50">{record.companyName} • {record.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => {
                        onSelectRecord(record);
                        onNavigate('analysis-result');
                      }}
                      className="flex-1 px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
                    >
                      <span>View Report</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id, record.candidateName)}
                      className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center border border-rose-500/20"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-xs font-semibold text-white/60 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Candidate & Document</th>
                    <th className="py-3.5 px-6">Role & Company</th>
                    <th className="py-3.5 px-6">Evaluation Date</th>
                    <th className="py-3.5 px-6 text-center">ATS Match Score</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sm">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">{record.candidateName}</div>
                        <div className="text-xs text-white/50 font-mono flex items-center gap-1 mt-0.5">
                          <FileText className="w-3 h-3 text-indigo-400" /> {record.fileName}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-semibold text-white">{record.jobTitle}</div>
                        <div className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-white/40" /> {record.companyName}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-white/50 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-white/40" />
                          <span>{record.date}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                            record.matchScore >= 80
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : record.matchScore >= 70
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            record.matchScore >= 80 ? 'bg-emerald-400' : record.matchScore >= 70 ? 'bg-amber-400' : 'bg-rose-400'
                          }`}></span>
                          {record.matchScore}%
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              onSelectRecord(record);
                              onNavigate('analysis-result');
                            }}
                            className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>Open Report</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id, record.candidateName)}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer border border-rose-500/20"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
