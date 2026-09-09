import React, { useState } from 'react';
import { X, Wrench, Plus, Trash2, Calendar, FileSpreadsheet, Building, DollarSign } from 'lucide-react';
import { Computer, Printer, RepairRecord } from '../types';

interface RepairModalProps {
  device: Computer | Printer | null;
  deviceType: 'may_tinh' | 'may_in';
  onClose: () => void;
  onSaveRepair: (deviceId: string, repairs: RepairRecord[]) => void;
  onExportSingleReport: (device: Computer | Printer) => void;
}

export const RepairModal: React.FC<RepairModalProps> = ({
  device,
  deviceType,
  onClose,
  onSaveRepair,
  onExportSingleReport,
}) => {
  if (!device) return null;

  const [repairs, setRepairs] = useState<RepairRecord[]>([...(device.lichSuSuaChua || [])]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [ngay, setNgay] = useState(new Date().toISOString().slice(0, 10));
  const [noiDung, setNoiDung] = useState('');
  const [chiPhi, setChiPhi] = useState<number | ''>('');
  const [donViSua, setDonViSua] = useState('Tổ CNTT');

  const handleAddRepair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noiDung.trim()) return;

    const newRecord: RepairRecord = {
      id: 'rep-' + Date.now(),
      ngay,
      noiDung: noiDung.trim(),
      chiPhi: Number(chiPhi) || 0,
      donViSua: donViSua.trim() || 'Tổ CNTT',
    };

    const updated = [newRecord, ...repairs];
    setRepairs(updated);
    onSaveRepair(device.id, updated);

    // Reset Form
    setNoiDung('');
    setChiPhi('');
    setShowAddForm(false);
  };

  const handleDeleteRepair = (recordId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bản ghi sửa chữa này?')) {
      const updated = repairs.filter((r) => r.id !== recordId);
      setRepairs(updated);
      onSaveRepair(device.id, updated);
    }
  };

  const deviceName = deviceType === 'may_tinh'
    ? `Máy tính: ${(device as Computer).maQuanLy} (${(device as Computer).khoaPhong})`
    : `Máy in: ${(device as Printer).ten} - ${(device as Printer).maQuanLy}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Lịch Sử Sửa Chữa & Bảo Trì
              </h3>
              <p className="text-xs text-amber-300/90 mt-0.5">{deviceName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onExportSingleReport(device)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              title="Xuất lịch sử sửa chữa của máy này ra Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xuất Báo Cáo Máy</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Mã quản lý:</span>
              <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">{device.maQuanLy}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Tổng số lần sửa chữa:</span>
              <p className="text-sm font-bold text-blue-700 mt-0.5">{repairs.length} lần</p>
            </div>
          </div>

          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ghi Nhận Lần Sửa Chữa Mới</span>
            </button>
          ) : (
            <form onSubmit={handleAddRepair} className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-amber-600" />
                  <span>Thêm Nhật Ký Sửa Chữa</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Hủy
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Ngày Sửa Chữa (*)
                  </label>
                  <input
                    type="date"
                    value={ngay}
                    onChange={(e) => setNgay(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Đơn Vị Thực Hiện / Ghi Chú
                  </label>
                  <input
                    type="text"
                    value={donViSua}
                    onChange={(e) => setDonViSua(e.target.value)}
                    placeholder="VD: Tổ CNTT / Cửa hàng Phong Vũ"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Ô NHẬP CHI PHÍ */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Chi Phí Sửa Chữa (VNĐ)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={chiPhi}
                    onChange={(e) => setChiPhi(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Nhập chi phí (VD: 150000)"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nội Dung Sửa Chữa / Thay Thế Linh Kiện (*)
                </label>
                <textarea
                  value={noiDung}
                  onChange={(e) => setNoiDung(e.target.value)}
                  required
                  rows={2}
                  placeholder="VD: Thay bao lụa máy in, nạp mực, thay ổ cứng SSD 256GB..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
                >
                  Lưu Lần Sửa Chữa
                </button>
              </div>
            </form>
          )}

          {/* List */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
              Danh Sách Các Lần Sửa Chữa
            </h4>

            {repairs.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                Chưa có lịch sử sửa chữa nào cho thiết bị này.
              </div>
            ) : (
              <div className="space-y-3">
                {repairs.map((r, idx) => (
                  <div
                    key={r.id || idx}
                    className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-amber-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold text-[11px] border border-amber-200">
                          Lần {repairs.length - idx}
                        </span>
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {r.ngay ? r.ngay.split('-').reverse().join('/') : r.ngaySua || 'N/A'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 font-medium pl-1">{r.noiDung}</p>

                      <div className="flex items-center gap-3 pl-1 text-[11px]">
                        {r.donViSua && (
                          <span className="text-slate-500 flex items-center gap-1">
                            <Building className="w-3 h-3 text-slate-400" />
                            Thực hiện: {r.donViSua}
                          </span>
                        )}
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Chi phí: {r.chiPhi ? Number(r.chiPhi).toLocaleString('vi-VN') : 0} VNĐ
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteRepair(r.id)}
                      className="self-end sm:self-center p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa dòng sửa chữa này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow transition-colors cursor-pointer"
          >
            Đóng Lại
          </button>
        </div>
      </div>
    </div>
  );
};