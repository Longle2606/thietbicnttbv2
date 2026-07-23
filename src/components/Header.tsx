import React from 'react';
import { Download, FileSpreadsheet, LogOut, Monitor as MonitorIcon, Printer as PrinterIcon, HardDrive, RefreshCw, Plus, ShieldCheck, FileUp } from 'lucide-react';
import { downloadTemplate } from '../utils/excelHelpers';

interface HeaderProps {
  username: string;
  onLogout: () => void;
  onOpenImportModal: () => void;
  onExportExcel: () => void;
  onResetData: () => void;
  onAddNew: (type: 'may_tinh' | 'may_in' | 'man_hinh') => void;
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  departments: string[];
}

export const Header: React.FC<HeaderProps> = ({
  username,
  onLogout,
  onOpenImportModal,
  onExportExcel,
  onResetData,
  onAddNew,
  selectedDept,
  setSelectedDept,
  departments,
}) => {
  const [showDropdownNew, setShowDropdownNew] = React.useState(false);
  const [showDropdownTemplate, setShowDropdownTemplate] = React.useState(false);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / App Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-inner">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-100 flex items-center gap-2">
                Bệnh viện II Lâm Đồng
              </h1>
              <p className="text-xs text-slate-400">Quản lý thiết bị CNTT • Máy tính • Máy in • Màn hình</p>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Filter by Department dropdown */}
            <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-400 font-medium">Khoa phòng:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer pr-2 font-medium"
              >
                <option value="all" className="bg-slate-900 text-white">--- Tất cả khoa phòng ---</option>
                {departments.map((d) => (
                  <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                ))}
              </select>
            </div>

            {/* Thêm mới Button Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdownNew(!showDropdownNew)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Mới</span>
              </button>

              {showDropdownNew && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs"
                  onMouseLeave={() => setShowDropdownNew(false)}
                >
                  <button
                    onClick={() => { onAddNew('may_tinh'); setShowDropdownNew(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-2 text-slate-200"
                  >
                    <HardDrive className="w-4 h-4 text-blue-400" />
                    <span>Thêm Máy Tính</span>
                  </button>
                  <button
                    onClick={() => { onAddNew('may_in'); setShowDropdownNew(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-2 text-slate-200"
                  >
                    <PrinterIcon className="w-4 h-4 text-emerald-400" />
                    <span>Thêm Máy In</span>
                  </button>
                  <button
                    onClick={() => { onAddNew('man_hinh'); setShowDropdownNew(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-2 text-slate-200"
                  >
                    <MonitorIcon className="w-4 h-4 text-purple-400" />
                    <span>Thêm Màn Hình</span>
                  </button>
                </div>
              )}
            </div>

            {/* Import Excel */}
            <button
              onClick={onOpenImportModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer border border-indigo-500/30"
              title="Nhập danh sách thiết bị từ file Excel"
            >
              <FileUp className="w-4 h-4" />
              <span className="hidden sm:inline">Import Excel</span>
            </button>

            {/* Export Excel */}
            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
              title="Xuất báo cáo Excel theo khoa phòng hoặc tất cả"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Xuất Excel</span>
            </button>

            {/* File Mẫu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdownTemplate(!showDropdownTemplate)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition-colors cursor-pointer"
                title="Tải file mẫu Excel chuẩn"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden lg:inline">File Mẫu</span>
              </button>

              {showDropdownTemplate && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs"
                  onMouseLeave={() => setShowDropdownTemplate(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Tải mẫu Excel chuẩn:
                  </div>
                  <button
                    onClick={() => { downloadTemplate('may_tinh'); setShowDropdownTemplate(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-700 text-slate-200 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    <span>Mẫu Máy Tính (.xlsx)</span>
                  </button>
                  <button
                    onClick={() => { downloadTemplate('may_in'); setShowDropdownTemplate(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-700 text-slate-200 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mẫu Máy In (.xlsx)</span>
                  </button>
                  <button
                    onClick={() => { downloadTemplate('man_hinh'); setShowDropdownTemplate(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-700 text-slate-200 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-purple-400" />
                    <span>Mẫu Màn Hình (.xlsx)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Admin Profile & Logout */}
            <div className="pl-2 border-l border-slate-800 flex items-center space-x-2">
              <div className="hidden xl:flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-medium text-slate-200">{username}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Đăng xuất khỏi hệ thống"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
