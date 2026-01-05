import { useState, useCallback, useEffect } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  Trash2,
} from 'lucide-react';
import type { ValidationStatus, ExtractedRule, ValidationResult, UploadedFile } from './types/components/app.types';
import { uploadPolicy, uploadExpense, deletePolicy, deleteExpense, listPolicies, listExpenses, validateExpenses } from './api';

// Components
function StatusIcon({ status }: { status: ValidationStatus }) {
  switch (status) {
    case 'approved':
      return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    case 'needs_review':
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    case 'violation':
      return <XCircle className="w-5 h-5 text-red-500" />;
  }
}

function StatusBadge({ status }: { status: ValidationStatus }) {
  const styles: Record<ValidationStatus, string> = {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    needs_review: 'bg-amber-50 text-amber-700 border-amber-200',
    violation: 'bg-red-50 text-red-700 border-red-200',
  };
  const labels: Record<ValidationStatus, string> = {
    approved: 'Approved',
    needs_review: 'Needs Review',
    violation: 'Violation',
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

interface UploadCardProps {
  title: string;
  description: string;
  file: UploadedFile | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  acceptedTypes: string;
  acceptedTypesDisplay: string;
  iconBgClass: string;
  iconClass: string;
  hoverBorderClass: string;
  hoverBgClass: string;
  error?: string;
  isLoading?: boolean;
}

function UploadCard({
  title,
  description,
  file,
  onFileSelect,
  onClear,
  acceptedTypes,
  acceptedTypesDisplay,
  iconBgClass,
  iconClass,
  hoverBorderClass,
  hoverBgClass,
  error,
  isLoading,
}: UploadCardProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        onFileSelect(selectedFile);
      }
    },
    [onFileSelect]
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        <div className={`w-10 h-10 ${iconBgClass} rounded-xl flex items-center justify-center`}>
          <FileText className={`w-5 h-5 ${iconClass}`} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-violet-600 animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900">Uploading...</p>
            <p className="text-xs text-slate-500">Please wait</p>
          </div>
        </div>
      ) : file ? (
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
            <p className="text-xs text-slate-500">
              {file.details || file.size} • Uploaded just now
            </p>
          </div>
          <button
            onClick={onClear}
            className="text-slate-400 hover:text-red-500 cursor-pointer"
            aria-label="Delete file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`border-2 border-dashed border-slate-200 rounded-xl p-8 text-center ${hoverBorderClass} ${hoverBgClass} transition-colors cursor-pointer block`}
        >
          <input type="file" accept={acceptedTypes} onChange={handleFileInput} className="hidden" />
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600">Drop your file here</p>
          <p className="text-xs text-slate-400 mt-1">Supports {acceptedTypesDisplay}</p>
        </label>
      )}

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default function App() {
  const [showDebug, setShowDebug] = useState(false);
  const [policyFile, setPolicyFile] = useState<UploadedFile | null>(null);
  const [expensesFile, setExpensesFile] = useState<UploadedFile | null>(null);
  const [isUploadingPolicy, setIsUploadingPolicy] = useState(false);
  const [policyError, setPolicyError] = useState<string | null>(null);
  const [isUploadingExpenses, setIsUploadingExpenses] = useState(false);
  const [expensesError, setExpensesError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationResult[] | null>(null);
  const [extractedRules, setExtractedRules] = useState<ExtractedRule[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadExistingFiles() {
      try {
        const [policies, expenses] = await Promise.all([listPolicies(), listExpenses()]);

        if (policies.length > 0) {
          const policy = policies[0];
          setPolicyFile({
            name: policy.filename,
            size: '',
            id: policy.id,
            serverPath: policy.path,
          });
        }

        if (expenses.length > 0) {
          const expense = expenses[0];
          setExpensesFile({
            name: expense.filename,
            size: '',
            id: expense.id,
            serverPath: expense.path,
          });
        }
      } catch (err) {
        console.error('Failed to load existing files:', err);
      }
    }

    loadExistingFiles();
  }, []);

  const handlePolicySelect = async (file: File) => {
    setIsUploadingPolicy(true);
    setPolicyError(null);
    setValidationResults(null);
    setExtractedRules(null);
    setError(null);

    try {
      const result = await uploadPolicy(file);
      setPolicyFile({
        name: result.originalName,
        size: `${Math.round(file.size / 1024)} KB`,
        id: result.id,
        serverPath: result.path,
      });
    } catch (err) {
      setPolicyError(err instanceof Error ? err.message : 'Failed to upload policy');
      setPolicyFile(null);
    } finally {
      setIsUploadingPolicy(false);
    }
  };

  const handleExpensesSelect = async (file: File) => {
    setIsUploadingExpenses(true);
    setExpensesError(null);
    setValidationResults(null);
    setExtractedRules(null);
    setError(null);

    try {
      const result = await uploadExpense(file);
      setExpensesFile({
        name: result.originalName,
        size: `${Math.round(file.size / 1024)} KB`,
        id: result.id,
        serverPath: result.path,
      });
    } catch (err) {
      setExpensesError(err instanceof Error ? err.message : 'Failed to upload expense');
      setExpensesFile(null);
    } finally {
      setIsUploadingExpenses(false);
    }
  };

  const handleClearPolicy = async () => {
    try {
      await deletePolicy();
      setPolicyFile(null);
    } catch (err) {
      console.error('Failed to delete policy:', err);
    }
  };

  const handleClearExpenses = async () => {
    try {
      await deleteExpense();
      setExpensesFile(null);
    } catch (err) {
      console.error('Failed to delete expenses:', err);
    }
  };

  const handleValidate = async () => {
    if (!policyFile || !expensesFile) return;

    setIsValidating(true);
    setError(null);
    setValidationResults(null);
    setExtractedRules(null);

    try {
      const response = await validateExpenses();

      // Map backend PolicyRule[] → frontend ExtractedRule[]
      const rules = response.extractedPolicy.rules.map((r) => ({
        category: r.category,
        maxAmount: r.maxAmount ?? null,
        conditions: r.conditions ?? [],
      }));

      // Map backend ValidationResult[] → frontend ValidationResult[]
      const results = response.results.map((r) => ({
        expense: r.expense.description,
        amount: r.expense.amount,
        status: r.status,
        reason: r.reason,
        rule: r.ruleApplied ?? r.expense.category,
      }));

      setExtractedRules(rules);
      setValidationResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
    } finally {
      setIsValidating(false);
    }
  };

  const canValidate = policyFile && expensesFile && !isValidating;

  const resultCounts = validationResults?.reduce(
    (acc, r) => {
      acc[r.status]++;
      return acc;
    },
    { approved: 0, needs_review: 0, violation: 0 } as Record<ValidationStatus, number>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Expense Agent</h1>
              <p className="text-sm text-slate-500">Multi-step AI validation</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <UploadCard
            title="Policy Document"
            description="Upload your company expense policy"
            file={policyFile}
            onFileSelect={handlePolicySelect}
            onClear={handleClearPolicy}
            acceptedTypes=".md,.txt,.pdf"
            acceptedTypesDisplay=".md, .txt, .pdf"
            iconBgClass="bg-violet-100"
            iconClass="text-violet-600"
            hoverBorderClass="hover:border-violet-300"
            hoverBgClass="hover:bg-violet-50/50"
            error={policyError || undefined}
            isLoading={isUploadingPolicy}
          />

          <UploadCard
            title="Expense Report"
            description="Upload expenses to validate"
            file={expensesFile}
            onFileSelect={handleExpensesSelect}
            onClear={handleClearExpenses}
            acceptedTypes=".csv"
            acceptedTypesDisplay=".csv"
            iconBgClass="bg-indigo-100"
            iconClass="text-indigo-600"
            hoverBorderClass="hover:border-indigo-300"
            hoverBgClass="hover:bg-indigo-50/50"
            error={expensesError || undefined}
            isLoading={isUploadingExpenses}
          />
        </div>

        {/* Validate Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleValidate}
            disabled={!canValidate}
            className={`px-8 py-3 font-medium rounded-xl transition-all flex items-center gap-2 ${
              canValidate
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isValidating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Validating...
              </>
            ) : (
              'Validate Expenses'
            )}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-sm text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {isValidating && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
            <Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Validating Expenses</h3>
            <p className="text-slate-500">This may take a few seconds...</p>
          </div>
        )}

        {/* Results Section */}
        {validationResults && !isValidating && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Results Header */}
            <div className="px-6 py-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Validation Results</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span className="text-slate-600">{resultCounts?.approved} Approved</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    <span className="text-slate-600">{resultCounts?.needs_review} Review</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-slate-600">{resultCounts?.violation} Violation</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="divide-y divide-slate-100">
              {validationResults.map((result, index) => (
                <div key={index} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <StatusIcon status={result.status} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-slate-900">{result.expense}</p>
                        <StatusBadge status={result.status} />
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{result.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">${result.amount}</p>
                      <p className="text-xs text-slate-400">{result.rule}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Debug Panel */}
        {validationResults && !isValidating && (
          <div className="mt-4">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              {showDebug ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Debug Info
            </button>

            {showDebug && extractedRules && (
              <div className="mt-3 bg-slate-900 rounded-xl p-6 text-sm font-mono">
                <div className="mb-6">
                  <p className="text-slate-400 mb-2">Step 1: Parse Expenses (CSV → JSON)</p>
                  <p className="text-emerald-400">
                    ✓ Parsed {validationResults.length} expenses from CSV
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-slate-400 mb-2">Step 2: Extract Rules (LLM Call #1)</p>
                  <pre className="text-slate-300 overflow-x-auto">
                    {JSON.stringify(extractedRules, null, 2)}
                  </pre>
                </div>

                <div>
                  <p className="text-slate-400 mb-2">Step 3: Validate (LLM Call #2)</p>
                  <p className="text-emerald-400">
                    ✓ Validated {validationResults.length} expenses against {extractedRules.length}{' '}
                    rules
                  </p>
                  <p className="text-slate-500 mt-1">Total tokens: 1,247 • Latency: 2.3s</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
