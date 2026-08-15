import React, { useState } from 'react';
import { Download, Loader2, FileCheck } from 'lucide-react';
import { exportDashboardToPDF } from '../utils/pdfGenerator';

export default function ExportReport({ elementId = 'developer-report-container', username = 'developer' }) {
  const [exporting, setExporting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportDashboardToPDF(elementId, username);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (e) {
      console.error('PDF export error:', e);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all hover:scale-105 no-print"
    >
      {exporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : downloaded ? (
        <>
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400">PDF Downloaded!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Download Report (PDF)</span>
        </>
      )}
    </button>
  );
}
