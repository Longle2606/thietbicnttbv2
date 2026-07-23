import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { DashboardStats } from './components/DashboardStats';
import { ComputerList } from './components/ComputerList';
import { PrinterList } from './components/PrinterList';
import { MonitorList } from './components/MonitorList';
import { RepairModal } from './components/RepairModal';
import { ImportModal } from './components/ImportModal';
import { EquipmentFormModal } from './components/EquipmentFormModal';

import { Computer, EquipmentStatus, Monitor, Printer, RepairRecord } from './types';
import { DEPARTMENTS_LIST, INITIAL_COMPUTERS, INITIAL_MONITORS, INITIAL_PRINTERS } from './data/initialData';
import { exportEquipmentToExcel, exportSingleDeviceReport, ParsedImportResult } from './utils/excelHelpers';
import { supabase } from './supabaseClient';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('it_app_auth') === 'true';
  });
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('it_app_user') || 'admin';
  });

  // Equipment Datasets State
  const [computers, setComputers] = useState<Computer[]>(INITIAL_COMPUTERS);
  const [printers, setPrinters] = useState<Printer[]>(INITIAL_PRINTERS);
  const [monitors, setMonitors] = useState<Monitor[]>(INITIAL_MONITORS);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters State
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'may_tinh' | 'may_in' | 'man_hinh'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | EquipmentStatus>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal States
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [formModalType, setFormModalType] = useState<'may_tinh' | 'may_in' | 'man_hinh'>('may_tinh');
  const [editingItem, setEditingItem] = useState<Computer | Printer | Monitor | null>(null);

  const [showRepairModal, setShowRepairModal] = useState<boolean>(false);
  const [repairDevice, setRepairDevice] = useState<Computer | Printer | null>(null);
  const [repairDeviceType, setRepairDeviceType] = useState<'may_tinh' | 'may_in'>('may_tinh');

  // Load Data on Mount
  useEffect(() => {
    fetchDataFromSupabase();
  }, []);

  // Lấy dữ liệu trực tiếp từ Supabase
  const fetchDataFromSupabase = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('devices').select('*');
      if (error) throw error;

      if (data && data.length > 0) {
        const fetchedComputers: Computer[] = [];
        const fetchedPrinters: Printer[] = [];
        const fetchedMonitors: Monitor[] = [];

        data.forEach((row) => {
          if (row.type === 'may_tinh') fetchedComputers.push(row.data);
          else if (row.type === 'may_in') fetchedPrinters.push(row.data);
          else if (row.type === 'man_hinh') fetchedMonitors.push(row.data);
        });

        setComputers(fetchedComputers);
        setPrinters(fetchedPrinters);
        setMonitors(fetchedMonitors);
      }
    } catch (err) {
      console.warn('Không thể nạp dữ liệu Supabase, sử dụng dữ liệu mặc định:', err);
    } finally {
      setLoading(false);
    }
  };

  // Đồng bộ hóa danh sách thiết bị lên Supabase
  const syncSaveData = async (newComputers: Computer[], newPrinters: Printer[], newMonitors: Monitor[]) => {
    setComputers(newComputers);
    setPrinters(newPrinters);
    setMonitors(newMonitors);

    try {
      const rowsToUpsert = [
        ...newComputers.map((c) => ({ id: c.id, type: 'may_tinh', data: c, updated_at: new Date().toISOString() })),
        ...newPrinters.map((p) => ({ id: p.id, type: 'may_in', data: p, updated_at: new Date().toISOString() })),
        ...newMonitors.map((m) => ({ id: m.id, type: 'man_hinh', data: m, updated_at: new Date().toISOString() })),
      ];

      if (rowsToUpsert.length > 0) {
        const { error } = await supabase.from('devices').upsert(rowsToUpsert, { onConflict: 'id' });
        if (error) console.error('Lỗi khi đồng bộ Supabase:', error);
      }
    } catch (err) {
      console.error('Lỗi lưu server Supabase:', err);
    }
  };

  // Xóa 1 thiết bị khỏi Supabase
  const deleteDeviceFromSupabase = async (id: string) => {
    try {
      await supabase.from('devices').delete().eq('id', id);
    } catch (err) {
      console.error('Lỗi xóa thiết bị Supabase:', err);
    }
  };

  const handleLoginSuccess = (user: string) => {
    setIsLoggedIn(true);
    setUsername(user);
    localStorage.setItem('it_app_auth', 'true');
    localStorage.setItem('it_app_user', user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('it_app_auth');
    localStorage.removeItem('it_app_user');
  };

  const handleResetData = async () => {
    if (confirm('Bạn có chắc muốn khôi phục dữ liệu ban đầu? Tất cả thay đổi sẽ bị làm mới.')) {
      try {
        await supabase.from('devices').delete().neq('id', '0'); // Xóa sạch dữ liệu trên Supabase
        await syncSaveData(INITIAL_COMPUTERS, INITIAL_PRINTERS, INITIAL_MONITORS);
        alert('Đã khôi phục dữ liệu gốc thành công!');
      } catch (err) {
        setComputers(INITIAL_COMPUTERS);
        setPrinters(INITIAL_PRINTERS);
        setMonitors(INITIAL_MONITORS);
      }
    }
  };

  // --- CRUD HANDLERS ---
  const handleAddNew = (type: 'may_tinh' | 'may_in' | 'man_hinh') => {
    setFormModalType(type);
    setEditingItem(null);
    setShowFormModal(true);
  };

  const handleEditComputer = (computer: Computer) => {
    setFormModalType('may_tinh');
    setEditingItem(computer);
    setShowFormModal(true);
  };

  const handleEditPrinter = (printer: Printer) => {
    setFormModalType('may_in');
    setEditingItem(printer);
    setShowFormModal(true);
  };

  const handleEditMonitor = (monitor: Monitor) => {
    setFormModalType('man_hinh');
    setEditingItem(monitor);
    setShowFormModal(true);
  };

  const handleDeleteComputer = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa máy tính này khỏi hệ thống?')) {
      const updated = computers.filter((c) => c.id !== id);
      await deleteDeviceFromSupabase(id);
      syncSaveData(updated, printers, monitors);
    }
  };

  const handleDeletePrinter = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa máy in này khỏi hệ thống?')) {
      const updated = printers.filter((p) => p.id !== id);
      await deleteDeviceFromSupabase(id);
      syncSaveData(computers, updated, monitors);
    }
  };

  const handleDeleteMonitor = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa màn hình này khỏi hệ thống?')) {
      const updated = monitors.filter((m) => m.id !== id);
      await deleteDeviceFromSupabase(id);
      syncSaveData(computers, printers, updated);
    }
  };

  const handleSaveComputer = (computerData: Computer) => {
    let updated: Computer[];
    if (editingItem) {
      updated = computers.map((c) => (c.id === computerData.id ? computerData : c));
    } else {
      updated = [computerData, ...computers];
    }
    syncSaveData(updated, printers, monitors);
  };

  const handleSavePrinter = (printerData: Printer) => {
    let updated: Printer[];
    if (editingItem) {
      updated = printers.map((p) => (p.id === printerData.id ? printerData : p));
    } else {
      updated = [printerData, ...printers];
    }
    syncSaveData(computers, updated, monitors);
  };

  const handleSaveMonitor = (monitorData: Monitor) => {
    let updated: Monitor[];
    if (editingItem) {
      updated = monitors.map((m) => (m.id === monitorData.id ? monitorData : m));
    } else {
      updated = [monitorData, ...monitors];
    }
    syncSaveData(computers, printers, updated);
  };

  // --- REPAIR MODAL HANDLER ---
  const handleOpenComputerRepairModal = (computer: Computer) => {
    setRepairDevice(computer);
    setRepairDeviceType('may_tinh');
    setShowRepairModal(true);
  };

  const handleOpenPrinterRepairModal = (printer: Printer) => {
    setRepairDevice(printer);
    setRepairDeviceType('may_in');
    setShowRepairModal(true);
  };

  const handleSaveRepairHistory = (deviceId: string, repairs: RepairRecord[]) => {
    if (repairDeviceType === 'may_tinh') {
      const updated = computers.map((c) => (c.id === deviceId ? { ...c, lichSuSuaChua: repairs } : c));
      syncSaveData(updated, printers, monitors);
      if (repairDevice && repairDevice.id === deviceId) {
        setRepairDevice({ ...repairDevice, lichSuSuaChua: repairs });
      }
    } else {
      const updated = printers.map((p) => (p.id === deviceId ? { ...p, lichSuSuaChua: repairs } : p));
      syncSaveData(computers, updated, monitors);
      if (repairDevice && repairDevice.id === deviceId) {
        setRepairDevice({ ...repairDevice, lichSuSuaChua: repairs });
      }
    }
  };

  // --- IMPORT EXCEL CONFIRM ---
  const handleImportConfirm = (result: ParsedImportResult, type: 'man_hinh' | 'may_tinh' | 'may_in') => {
    if (type === 'man_hinh') {
      const newItems: Monitor[] = result.monitors.map((m, idx) => ({
        id: 'mh-imp-' + Date.now() + '-' + idx,
        maQuanLy: m.maQuanLy || 'MH-NEW-' + idx,
        ten: m.ten || 'Màn hình import',
        khoaPhong: m.khoaPhong || 'Khoa Khám Bệnh',
        tinhTrang: m.tinhTrang || 'hoat_dong',
        ghiChu: m.ghiChu || 'Import từ file Excel',
      }));
      const updated = [...newItems, ...monitors];
      syncSaveData(computers, printers, updated);
      alert(`Đã nhập thành công ${newItems.length} màn hình vào hệ thống!`);
    } else if (type === 'may_tinh') {
      const newItems: Computer[] = result.computers.map((c, idx) => ({
        id: 'pc-imp-' + Date.now() + '-' + idx,
        maQuanLy: c.maQuanLy || 'PC-NEW-' + idx,
        cauHinh: c.cauHinh || '',
        ram: c.ram || '',
        viTriSuDung: c.viTriSuDung || '',
        khoaPhong: c.khoaPhong || 'Khoa Khám Bệnh',
        maManHinh: c.maManHinh || '',
        namSuDung: c.namSuDung || new Date().getFullYear(),
        nguyenGia: c.nguyenGia || 0,
        tinhTrang: c.tinhTrang || 'hoat_dong',
        lichSuSuaChua: [],
      }));
      const updated = [...newItems, ...computers];
      syncSaveData(updated, printers, monitors);
      alert(`Đã nhập thành công ${newItems.length} máy tính vào hệ thống!`);
    } else if (type === 'may_in') {
      const newItems: Printer[] = result.printers.map((p, idx) => ({
        id: 'pr-imp-' + Date.now() + '-' + idx,
        maQuanLy: p.maQuanLy || 'IN-NEW-' + idx,
        ten: p.ten || 'Máy in import',
        khoaPhong: p.khoaPhong || 'Khoa Khám Bệnh',
        namSuDung: p.namSuDung || new Date().getFullYear(),
        nguyenGia: p.nguyenGia || 0,
        tinhTrang: p.tinhTrang || 'hoat_dong',
        lichSuSuaChua: [],
      }));
      const updated = [...newItems, ...printers];
      syncSaveData(computers, updated, monitors);
      alert(`Đã nhập thành công ${newItems.length} máy in vào hệ thống!`);
    }
  };

  // --- EXPORT HANDLERS ---
  const handleExportExcelAll = () => {
    exportEquipmentToExcel(computers, printers, monitors, selectedDept);
  };

  const handleExportSingleReport = (device: Computer | Printer) => {
    const isComputer = 'cauHinh' in device;
    let mappedMon: Monitor | undefined = undefined;
    if (isComputer) {
      const comp = device as Computer;
      mappedMon = monitors.find((m) => m.maQuanLy.toLowerCase() === comp.maManHinh?.toLowerCase());
    }
    exportSingleDeviceReport(device, isComputer ? 'may_tinh' : 'may_in', mappedMon);
  };

  // --- FILTERED LISTS FOR DISPLAY ---
  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  const filteredComputers = computers.filter((c) => {
    const deptOk = selectedDept === 'all' || c.khoaPhong === selectedDept;
    const statusOk = statusFilter === 'all' || c.tinhTrang === statusFilter;
    const searchOk =
      matchesSearch(c.maQuanLy) ||
      matchesSearch(c.khoaPhong) ||
      matchesSearch(c.cauHinh) ||
      matchesSearch(c.viTriSuDung) ||
      matchesSearch(c.ram) ||
      matchesSearch(c.maManHinh);
    return deptOk && statusOk && searchOk;
  });

  const filteredPrinters = printers.filter((p) => {
    const deptOk = selectedDept === 'all' || p.khoaPhong === selectedDept;
    const statusOk = statusFilter === 'all' || p.tinhTrang === statusFilter;
    const searchOk =
      matchesSearch(p.maQuanLy) ||
      matchesSearch(p.ten) ||
      matchesSearch(p.khoaPhong);
    return deptOk && statusOk && searchOk;
  });

  const filteredMonitors = monitors.filter((m) => {
    const deptOk = selectedDept === 'all' || m.khoaPhong === selectedDept;
    const statusOk = statusFilter === 'all' || m.tinhTrang === statusFilter;
    const searchOk =
      matchesSearch(m.maQuanLy) ||
      matchesSearch(m.ten) ||
      matchesSearch(m.khoaPhong) ||
      matchesSearch(m.ghiChu || '');
    return deptOk && statusOk && searchOk;
  });

  // Extract unique departments dynamically from data
  const allDepartments = Array.from(
    new Set([
      ...DEPARTMENTS_LIST,
      ...computers.map((c) => c.khoaPhong),
      ...printers.map((p) => p.khoaPhong),
      ...monitors.map((m) => m.khoaPhong),
    ])
  ).filter(Boolean);

  if (!isLoggedIn) {
    return <LoginModal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-800 pb-12">
      {/* Header Bar */}
      <Header
        username={username}
        onLogout={handleLogout}
        onOpenImportModal={() => setShowImportModal(true)}
        onExportExcel={handleExportExcelAll}
        onResetData={handleResetData}
        onAddNew={handleAddNew}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        departments={allDepartments}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Dashboard Overview Stats & Controls */}
        <DashboardStats
          computers={computers}
          printers={printers}
          monitors={monitors}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          departments={allDepartments}
        />

        {/* Equipment Tab Content */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl shadow-sm">
            <span className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3" />
            <p className="text-xs font-semibold text-slate-600">Đang tải danh sách thiết bị...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {(activeTab === 'all' || activeTab === 'may_tinh') && (
              <ComputerList
                computers={filteredComputers}
                monitors={monitors}
                onEdit={handleEditComputer}
                onDelete={handleDeleteComputer}
                onOpenRepairModal={handleOpenComputerRepairModal}
                onExportSingleReport={handleExportSingleReport}
              />
            )}

            {(activeTab === 'all' || activeTab === 'may_in') && (
              <PrinterList
                printers={filteredPrinters}
                onEdit={handleEditPrinter}
                onDelete={handleDeletePrinter}
                onOpenRepairModal={handleOpenPrinterRepairModal}
                onExportSingleReport={handleExportSingleReport}
              />
            )}

            {(activeTab === 'all' || activeTab === 'man_hinh') && (
              <MonitorList
                monitors={filteredMonitors}
                onEdit={handleEditMonitor}
                onDelete={handleDeleteMonitor}
              />
            )}
          </div>
        )}
      </main>

      {/* MODALS */}
      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImportConfirm={handleImportConfirm}
        />
      )}

      {showFormModal && (
        <EquipmentFormModal
          type={formModalType}
          editingItem={editingItem}
          monitorsList={monitors}
          departments={allDepartments}
          onClose={() => setShowFormModal(false)}
          onSaveComputer={handleSaveComputer}
          onSavePrinter={handleSavePrinter}
          onSaveMonitor={handleSaveMonitor}
        />
      )}

      {showRepairModal && (
        <RepairModal
          device={repairDevice}
          deviceType={repairDeviceType}
          onClose={() => setShowRepairModal(false)}
          onSaveRepair={handleSaveRepairHistory}
          onExportSingleReport={handleExportSingleReport}
        />
      )}
    </div>
  );
}