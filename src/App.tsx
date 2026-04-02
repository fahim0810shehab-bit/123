import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { analyzeTranscripts, type AnalysisLevel } from './services/gemini';
import { 
  Loader2, Sparkles, ChevronRight, AlertCircle, Clock, FileText, Trash2, 
  LayoutDashboard, Settings, History, Upload, Download, CheckCircle2, 
  BookOpen, BarChart3, Menu, X, Printer, LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useReactToPrint } from 'react-to-print';
import { cn } from '@/src/lib/utils';
import { Login, type User } from './components/Login';

interface HistoryItem {
  id: string | number;
  timestamp: number;
  program: string;
  level: number;
  fileName: string;
  result: string;
}

export default function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [level, setLevel] = useState<AnalysisLevel>(3); // Default to Level 3 (most useful)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'settings'>('dashboard');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const printRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('transcript_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  useEffect(() => {
    // Responsive sidebar
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('transcript_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('transcript_user');
    setHistory([]);
    setResult(null);
    setFiles([]);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `NSU_Transcript_Analysis_${new Date().toISOString().split('T')[0]}`,
  });

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/history?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error("Failed to fetch history", e);
    }
  };

  const saveToHistory = async (text: string, fileName: string) => {
    const newItem = {
      email: user.email,
      timestamp: Date.now(),
      program: "Auto-Detected", // Placeholder, actual program is in text
      level,
      fileName,
      result: text
    };
    
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      fetchHistory();
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const deleteHistoryItem = async (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    try {
      await fetch(`/api/history/${id}?email=${encodeURIComponent(user.email)}`, { method: 'DELETE' });
      fetchHistory();
    } catch (e) {
      console.error("Failed to delete history", e);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setResult(item.result);
    setLevel(item.level as AnalysisLevel);
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      setError("Please upload at least one transcript file.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setResultData(null);

    try {
      const analysisOutput = await analyzeTranscripts(files, level, undefined);
      setResult(analysisOutput.text);
      setResultData(analysisOutput.data);
      saveToHistory(analysisOutput.text, files[0].name + (files.length > 1 ? ` +${files.length - 1}` : ''));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = () => {
    setIsPreviewMode(true);
  };

  const handleDownloadJSON = () => {
    if (!resultData) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resultData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "transcript-audit-data.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (isPreviewMode && result) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center py-8 print:py-0 print:bg-white">
        {/* Preview Toolbar - Hidden when printing */}
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-50 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Print Preview</h3>
              <p className="text-xs text-slate-500">Review your document before printing</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPreviewMode(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Document Preview */}
        <div ref={printRef} id="analysis-result-content" className="w-full max-w-[210mm] bg-white shadow-xl print:shadow-none print:w-full print:max-w-none mt-20 print:mt-0 min-h-[297mm] p-[20mm] print:p-0 relative flex flex-col">
          
          {/* Content */}
          <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:font-bold prose-h1:text-3xl prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-justify prose-a:text-indigo-600 prose-strong:text-slate-900 prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-slate-300 prose-th:bg-slate-50 prose-th:p-2 prose-td:border prose-td:border-slate-300 prose-td:p-2 flex-grow">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
          </div>

          {/* Report Footer */}
          <div className="mt-auto pt-8 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400">
            <p>Confidential Student Record</p>
            <p>Generated by NSU Transcript Analyzer</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 print:hidden">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-slate-200 text-slate-600 print:hidden"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="fixed lg:sticky top-0 h-screen bg-slate-950 border-r border-slate-800 overflow-hidden z-40 flex-shrink-0 shadow-2xl lg:shadow-none print:hidden"
      >
        <div className="p-6 flex flex-col h-full w-[280px]">
          {/* Brand */}
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl p-1 shadow-md">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/North_South_University_Logo.svg/1200px-North_South_University_Logo.svg.png" 
                alt="NSU Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">NSU Analyzer</h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-0.5">Academic Audit</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                activeTab === 'dashboard' 
                  ? "bg-indigo-500/10 text-indigo-400 shadow-sm ring-1 ring-indigo-500/20" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              )}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                activeTab === 'history' 
                  ? "bg-indigo-500/10 text-indigo-400 shadow-sm ring-1 ring-indigo-500/20" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              )}
            >
              <History className="w-5 h-5" />
              <span>History</span>
              {history.length > 0 && (
                <span className="ml-auto bg-slate-800 text-slate-300 text-xs py-0.5 px-2 rounded-full font-mono">
                  {history.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                activeTab === 'settings' 
                  ? "bg-indigo-500/10 text-indigo-400 shadow-sm ring-1 ring-indigo-500/20" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              )}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>

          {/* User/Footer */}
          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="flex items-center p-3 bg-slate-900 rounded-xl mb-3 ring-1 ring-slate-800">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full mr-3 border border-slate-700" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-10 h-10 bg-indigo-900 rounded-full flex items-center justify-center mr-3 text-indigo-300 font-bold">
                  {user.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </motion.aside>


      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen w-full print:h-auto print:overflow-visible bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto px-6 py-10 lg:px-12 print:max-w-none print:px-0 print:py-0">
          
          {/* Header */}
          <header className="flex justify-between items-end mb-10 print:hidden">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                {activeTab === 'dashboard' && "Academic Dashboard"}
                {activeTab === 'history' && "Audit History"}
                {activeTab === 'settings' && "Configuration"}
              </h2>
              <p className="text-slate-500 mt-2 text-sm max-w-xl leading-relaxed">
                {activeTab === 'dashboard' && "Upload transcripts to generate comprehensive academic reports and check graduation requirements."}
                {activeTab === 'history' && "View and manage your past transcript analyses."}
                {activeTab === 'settings' && "Customize your analysis preferences."}
              </p>
            </div>
            {activeTab === 'dashboard' && result && (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleDownloadJSON}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200/80 rounded-xl shadow-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all font-medium text-sm ring-1 ring-transparent hover:ring-slate-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Export JSON</span>
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200/80 rounded-xl shadow-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all font-medium text-sm ring-1 ring-transparent hover:ring-slate-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            )}
          </header>

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Upload Section */}
              {!result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden"
                >
                  <div className="p-8 border-b border-slate-100/80 bg-slate-50/50">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-white border border-slate-200/60 shadow-sm rounded-lg text-slate-700">
                        <Upload className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">Upload Transcript</h3>
                    </div>
                    <p className="text-slate-500 text-sm max-w-xl mt-1">
                      Drag and drop your academic transcript (CSV format). Our system will analyze your grades, calculate CGPA, and check graduation requirements.
                    </p>
                  </div>
                  
                  <div className="p-8">
                    <FileUpload 
                      onFilesSelected={handleFilesSelected}
                      selectedFiles={files}
                      onRemoveFile={handleRemoveFile}
                    />

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 p-4 bg-red-50/50 text-red-700 rounded-xl flex items-start text-sm border border-red-100"
                      >
                        <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-red-500" />
                        <div>
                          <p className="font-medium text-red-900">Analysis Failed</p>
                          <p className="mt-1 text-red-700/90">{error}</p>
                        </div>
                      </motion.div>
                    )}

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || files.length === 0}
                        className={cn(
                          "flex items-center px-6 py-3 rounded-xl font-medium text-white transition-all duration-200 text-sm",
                          isAnalyzing || files.length === 0 
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                            : "bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ring-1 ring-slate-950"
                        )}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing Transcript...
                          </>
                        ) : (
                          <>
                            Generate Report
                            <ChevronRight className="w-4 h-4 ml-2 opacity-70" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Feature Highlights (Only when no result) */}
              {!result && !isAnalyzing && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: BarChart3, title: "CGPA Calculation", desc: "Accurate calculation excluding non-credit courses (W, I, AU)." },
                    { icon: BookOpen, title: "Course Mapping", desc: "Automatically identifies valid courses and categorizes them." },
                    { icon: CheckCircle2, title: "Graduation Check", desc: "Verifies credit requirements and mandatory courses for your major." }
                  ].map((feature, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-4 text-slate-600 group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2 tracking-tight">{feature.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Results View */}
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm print:hidden">
                    <div className="flex items-center space-x-4">
                      <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 tracking-tight">Analysis Complete</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Generated just now</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setResult(null)}
                      className="text-sm text-slate-500 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Start New Analysis
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden print:shadow-none print:border-none">
                    <div id="analysis-result-content" className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-slate-900 prose-strong:text-slate-900 p-8 lg:p-12 print:p-8">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* History View */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              {history.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <History className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight">No history yet</h3>
                  <p className="text-slate-500 text-sm">Upload a transcript to see your analysis history here.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100/80">
                  {history.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => loadHistoryItem(item)}
                      className="p-6 hover:bg-slate-50/80 transition-colors cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl group-hover:bg-white group-hover:border-slate-200 transition-colors">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1 tracking-tight">{item.fileName}</h4>
                          <div className="flex items-center space-x-3 text-sm text-slate-500">
                            <span className="flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                              {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                            <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200/60 rounded-full text-xs font-medium text-slate-600">
                              Level {item.level}
                            </span>
                            <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200/60 rounded-full text-xs font-medium text-slate-600">
                              {item.program}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => deleteHistoryItem(e, item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Delete record"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings View */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60">
                <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center tracking-tight">
                  <Sparkles className="w-5 h-5 text-slate-800 mr-2" />
                  Analysis Configuration
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Default Analysis Level</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[1, 2, 3].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setLevel(lvl as AnalysisLevel)}
                          className={cn(
                            "text-left p-4 rounded-xl border transition-all duration-200",
                            level === lvl 
                              ? "border-slate-900 bg-slate-900 shadow-md ring-1 ring-slate-950" 
                              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          )}
                        >
                          <span className={cn(
                            "block text-sm font-bold uppercase tracking-wider mb-1",
                            level === lvl ? "text-white" : "text-slate-500"
                          )}>
                            Level {lvl}
                          </span>
                          <span className={cn(
                            "text-xs",
                            level === lvl ? "text-slate-300" : "text-slate-500"
                          )}>
                            {lvl === 1 && "Basic Extraction"}
                            {lvl === 2 && "Trends & Major"}
                            {lvl === 3 && "Full Advising"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100/80">
                    <label className="block text-sm font-medium text-slate-700 mb-3">Custom Model Instructions</label>
                    <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                      Override the default analysis behavior with your own prompt instructions.
                    </p>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Enter custom instructions for the AI model..."
                      className="w-full h-40 p-4 text-sm border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none bg-slate-50/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
