import React from 'react';
import { HardDrive, Printer, Monitor as MonitorIcon, CheckCircle2, Search, Filter } from 'lucide-react';
import { Computer, EquipmentStatus, Monitor, Printer as PrinterType } from '../types';

interface DashboardStatsProps {
  computers: Computer[];
  printers: PrinterType[];
  monitors: Monitor[];
  activeTab: 'all' | 'may_tinh' | 'may_in' | 'man_hinh';
  setActiveTab: (tab: 'all' | 'may_tinh' | 'may_in' | 'man_hinh') => void;
  statusFilter: 'all' | EquipmentStatus;
  setStatusFilter: (status: 'all' | EquipmentStatus) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  departments: string[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  computers,
  printers,
  monitors,
  activeTab,
  setActiveTab,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  selectedDept,
  setSelectedDept,
  departments,
}) => {
  // Calculations based on selected department filter
  const isAllDept = selectedDept === 'all';
  const filteredComputers = isAllDept ? computers : computers.filter(c => c.khoaPhong === selectedDept);
  const filteredPrinters = isAllDept ? printers : printers.filter(p => p.khoaPhong === selectedDept);
  const filteredMonitors = isAllDept ? monitors : monitors.filter(m => m.khoaPhong === selectedDept);

  const totalComputers = filteredComputers.length;
  const totalPrinters = filteredPrinters.length;
  const totalMonitors = filteredMonitors.length;
  const totalDevices = totalComputers + totalPrinters + totalMonitors;

  // Active status counts
  const allDevicesList = [
    ...filteredComputers.map(c => ({ status: c.tinhTrang, value: c.nguyenGia, repairCost: c.lichSuSuaChua.reduce((s, r) => s + r.chiPhi, 0) })),
    ...filteredPrinters.map(p => ({ status: p.tinhTrang, value: p.nguyenGia, repairCost: p.lichSuSuaChua.reduce((s, r) => s + r.chiPhi, 0) })),
    ...filteredMonitors.map(m => ({ status: m.tinhTrang, value: 0, repairCost: 0 }))
  ];

  const activeCount = allDevicesList.filter(d => d.status === 'hoat_dong').length;
  const damagedCount = allDevicesList.filter(d => d.status === 'hu_hong').length;
  const liquidatedCount = allDevicesList.filter(d => d.status === 'thanh_ly').length;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Machines */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tổng Số Lượng Thiết Bị</p>
            <p className="text-2xl font-bold text-slate-900 mb-1">{totalDevices} <span className="text-xs font-normal text-slate-500">thiết bị</span></p>
            <div className="text-xs text-slate-600 space-y-0.5">
              <p><span className="font-semibold text-slate-700">Máy tính:</span> <span className="font-bold text-blue-600">{totalComputers}</span> máy</p>
              <p><span className="font-semibold text-slate-700">Máy in:</span> <span className="font-bold text-emerald-600">{totalPrinters}</span> máy</p>
              <p><span className="font-medium text-slate-500">Màn hình:</span> <span className="font-semibold text-purple-600">{totalMonitors}</span> cái</p>
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <HardDrive className="w-6 h-6" />
          </div>
        </div>

        {/* Operating Status */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tình Trạng Hoạt Động</p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-emerald-600">{activeCount}</span>
              <span className="text-xs text-slate-500 font-medium">thiết bị hoạt động tốt</span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <p><span className="font-semibold text-amber-600">Đã hư hỏng:</span> {damagedCount} thiết bị</p>
              <p><span className="font-semibold text-slate-600">Đã thanh lý:</span> {liquidatedCount} thiết bị</p>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Total Quantities Breakdown */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-start justify-between">
          <div className="w-full">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Số Lượng Theo Loại</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50/70 p-2.5 rounded-lg border border-blue-100">
                <span className="text-[11px] font-semibold text-blue-700 block">Máy tính</span>
                <span className="text-lg font-bold text-blue-900">{totalComputers} <span className="text-xs font-normal text-blue-700">máy</span></span>
              </div>
              <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100">
                <span className="text-[11px] font-semibold text-emerald-700 block">Máy in</span>
                <span className="text-lg font-bold text-emerald-900">{totalPrinters} <span className="text-xs font-normal text-emerald-700">máy</span></span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl ml-3 shrink-0">
            <Printer className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Equipment Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất Cả ({totalDevices})
            </button>
            <button
              onClick={() => setActiveTab('may_tinh')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'may_tinh'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-600" />
              <span>Máy Tính ({totalComputers})</span>
            </button>
            <button
              onClick={() => setActiveTab('may_in')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'may_in'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Máy In ({totalPrinters})</span>
            </button>
            <button
              onClick={() => setActiveTab('man_hinh')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'man_hinh'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MonitorIcon className="w-3.5 h-3.5 text-purple-600" />
              <span>Màn Hình ({totalMonitors})</span>
            </button>
          </div>

          {/* Search Box & Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã QL, tên, vị trí..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">--- Tất cả tình trạng ---</option>
                <option value="hoat_dong">🟢 Hoạt động</option>
                <option value="hu_hong">🟡 Đã hư hỏng</option>
                <option value="thanh_ly">🔴 Đã thanh lý</option>
              </select>
            </div>

            {/* Department Filter (Mobile/Tablet view) */}
            <div className="flex md:hidden items-center gap-1 w-full sm:w-auto">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">--- Tất cả khoa phòng ---</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
