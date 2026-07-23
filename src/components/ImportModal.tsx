import React, { useState } from 'react';
import { X, FileUp, Download, AlertCircle, CheckCircle2, HardDrive, Printer, Monitor as MonitorIcon, FileSpreadsheet } from 'lucide-react';
import { Computer, Monitor, Printer as PrinterType } from '../types';
import { downloadTemplate, parseExcelFile, ParsedImportResult } from '../utils/excelHelpers';

interface ImportModalProps {
  onClose: () => void;
  onImportConfirm: (result: ParsedImportResult, type: 'man_hinh' | 'may_tinh' | 'may_in') => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ onClose, onImportConfirm }) => {
  const [importType, setImportType] = useState<'may_tinh' | 'may_in' | 'man_hinh'>('may_tinh');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedImportResult | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setParsing(true);
    setParsedResult(null);

    const result = await parseExcelFile(file, importType);
    setParsedResult(result);
    setParsing(false);
  };

  const handleTypeChange = (type: 'may_tinh' | 'may_in' | 'man_hinh') => {
    setImportType(type);
    setSelectedFile(null);
    setParsedResult(null);
  };

  const handleConfirm = () => {
    if (parsedResult) {
      onImportConfirm(parsedResult, importType);
      onClose();
    }
  };

  const getRowCount = () => {
    if (!parsedResult) return 0;
    if (importType === 'may_tinh') return parsedResult.computers.length;
    if (importType === 'may_in') return parsedResult.printers.length;
    return parsedResult.monitors.length;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Nhập Danh Sách Thiết Bị Từ File Excel
              </h3>
              <p className="text-xs text-indigo-200/90 mt-0.5">
                Hỗ trợ định dạng .xlsx, .xls, .csv chuẩn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Step 1: Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Chọn loại thiết bị muốn nhập:
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('may_tinh')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  importType === 'may_tinh'
                    ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <HardDrive className={`w-5 h-5 ${importType === 'may_tinh' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Máy Tính</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('may_in')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  importType === 'may_in'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Printer className={`w-5 h-5 ${importType === 'may_in' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Máy In</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('man_hinh')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  importType === 'man_hinh'
                    ? 'bg-purple-50 border-purple-600 text-purple-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MonitorIcon className={`w-5 h-5 ${importType === 'man_hinh' ? 'text-purple-600' : 'text-slate-400'}`} />
                <span>Màn Hình</span>
              </button>
            </div>
          </div>

          {/* Step 2: Download Template Sample File */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-900">
                Chưa có file mẫu Excel chuẩn?
              </p>
              <p className="text-[11px] text-amber-800/80 mt-0.5">
                Tải xuống file mẫu đúng định dạng các cột bắt buộc.
              </p>
            </div>
            <button
              onClick={() => downloadTemplate(importType)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải File Mẫu</span>
            </button>
          </div>

          {/* Step 3: Choose File Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Tải lên file Excel (.xlsx / .csv):
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center bg-slate-50/50 transition-all">
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
                id="excel-file-input"
              />
              <label htmlFor="excel-file-input" className="cursor-pointer block">
                <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-bold text-blue-600 hover:underline block">
                  {selectedFile ? selectedFile.name : 'Bấm vào đây để chọn file Excel từ máy tính'}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Định dạng được hỗ trợ: XLSX, XLS, CSV
                </span>
              </label>
            </div>
          </div>

          {/* Step 4: Preview Result */}
          {parsing && (
            <div className="p-4 bg-blue-50 text-blue-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-2">
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
              <span>Đang phân tích dữ liệu từ file Excel...</span>
            </div>
          )}

          {parsedResult && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đã đọc thành công {getRowCount()} dòng hợp lệ</span>
                </div>
              </div>

              {parsedResult.errors.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
                  <p className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span>Lỗi phát hiện trong file ({parsedResult.errors.length} dòng):</span>
                  </p>
                  <ul className="text-[11px] text-red-700 list-disc pl-5 space-y-0.5 max-h-28 overflow-y-auto">
                    {parsedResult.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={!parsedResult || getRowCount() === 0}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow transition-colors cursor-pointer disabled:opacity-50"
          >
            Nhập {getRowCount()} Thiết Bị Vào Hệ Thống
          </button>
        </div>
      </div>
    </div>
  );
};
