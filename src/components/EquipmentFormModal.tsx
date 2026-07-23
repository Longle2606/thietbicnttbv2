import React, { useState, useEffect } from 'react';
import { X, HardDrive, Printer, Monitor as MonitorIcon, Save } from 'lucide-react';
import { Computer, EquipmentStatus, Monitor, Printer as PrinterType } from '../types';

interface EquipmentFormModalProps {
  type: 'may_tinh' | 'may_in' | 'man_hinh';
  editingItem: Computer | PrinterType | Monitor | null;
  monitorsList: Monitor[];
  departments: string[];
  onClose: () => void;
  onSaveComputer: (computer: Computer) => void;
  onSavePrinter: (printer: PrinterType) => void;
  onSaveMonitor: (monitor: Monitor) => void;
}

export const EquipmentFormModal: React.FC<EquipmentFormModalProps> = ({
  type,
  editingItem,
  monitorsList,
  departments,
  onClose,
  onSaveComputer,
  onSavePrinter,
  onSaveMonitor,
}) => {
  // Form fields
  const [maQuanLy, setMaQuanLy] = useState('');
  const [khoaPhong, setKhoaPhong] = useState(departments[0] || 'Khoa Khám Bệnh');
  const [tinhTrang, setTinhTrang] = useState<EquipmentStatus>('hoat_dong');

  // Computer specific
  const [cauHinh, setCauHinh] = useState('');
  const [ram, setRam] = useState('');
  const [viTriSuDung, setViTriSuDung] = useState('');
  const [maManHinh, setMaManHinh] = useState('');
  const [namSuDung, setNamSuDung] = useState<number>(new Date().getFullYear());
  const [nguyenGia, setNguyenGia] = useState<number>(0);

  // Printer & Monitor specific
  const [ten, setTen] = useState('');
  const [ghiChu, setGhiChu] = useState('');

  useEffect(() => {
    if (editingItem) {
      setMaQuanLy(editingItem.maQuanLy || '');
      setKhoaPhong(editingItem.khoaPhong || departments[0] || '');
      setTinhTrang(editingItem.tinhTrang || 'hoat_dong');

      if (type === 'may_tinh') {
        const comp = editingItem as Computer;
        setCauHinh(comp.cauHinh || '');
        setRam(comp.ram || '');
        setViTriSuDung(comp.viTriSuDung || '');
        setMaManHinh(comp.maManHinh || '');
        setNamSuDung(comp.namSuDung || new Date().getFullYear());
        setNguyenGia(comp.nguyenGia || 0);
      } else if (type === 'may_in') {
        const pr = editingItem as PrinterType;
        setTen(pr.ten || '');
        setNamSuDung(pr.namSuDung || new Date().getFullYear());
        setNguyenGia(pr.nguyenGia || 0);
      } else if (type === 'man_hinh') {
        const mon = editingItem as Monitor;
        setTen(mon.ten || '');
        setGhiChu(mon.ghiChu || '');
      }
    }
  }, [editingItem, type, departments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!maQuanLy.trim()) {
      alert('Vui lòng nhập Mã Quản Lý!');
      return;
    }

    if (type === 'may_tinh') {
      const computerData: Computer = {
        id: editingItem ? editingItem.id : 'pc-' + Date.now(),
        maQuanLy: maQuanLy.trim(),
        cauHinh: cauHinh.trim(),
        ram: ram.trim(),
        viTriSuDung: viTriSuDung.trim(),
        khoaPhong,
        maManHinh,
        namSuDung: Number(namSuDung) || new Date().getFullYear(),
        nguyenGia: Number(nguyenGia) || 0,
        tinhTrang,
        lichSuSuaChua: editingItem ? (editingItem as Computer).lichSuSuaChua || [] : [],
      };
      onSaveComputer(computerData);
    } else if (type === 'may_in') {
      if (!ten.trim()) {
        alert('Vui lòng nhập Tên Máy In!');
        return;
      }
      const printerData: PrinterType = {
        id: editingItem ? editingItem.id : 'pr-' + Date.now(),
        maQuanLy: maQuanLy.trim(),
        ten: ten.trim(),
        khoaPhong,
        namSuDung: Number(namSuDung) || new Date().getFullYear(),
        nguyenGia: Number(nguyenGia) || 0,
        tinhTrang,
        lichSuSuaChua: editingItem ? (editingItem as PrinterType).lichSuSuaChua || [] : [],
      };
      onSavePrinter(printerData);
    } else if (type === 'man_hinh') {
      if (!ten.trim()) {
        alert('Vui lòng nhập Tên Màn Hình!');
        return;
      }
      const monitorData: Monitor = {
        id: editingItem ? editingItem.id : 'mh-' + Date.now(),
        maQuanLy: maQuanLy.trim(),
        ten: ten.trim(),
        khoaPhong,
        tinhTrang,
        ghiChu: ghiChu.trim(),
      };
      onSaveMonitor(monitorData);
    }

    onClose();
  };

  const modalTitle = editingItem
    ? `Chỉnh Sửa ${type === 'may_tinh' ? 'Máy Tính' : type === 'may_in' ? 'Máy In' : 'Màn Hình'}`
    : `Thêm Mới ${type === 'may_tinh' ? 'Máy Tính' : type === 'may_in' ? 'Máy In' : 'Màn Hình'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              {type === 'may_tinh' && <HardDrive className="w-5 h-5" />}
              {type === 'may_in' && <Printer className="w-5 h-5" />}
              {type === 'man_hinh' && <MonitorIcon className="w-5 h-5" />}
            </div>
            <h3 className="text-base font-bold text-white">{modalTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mã quản lý */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Mã Quản Lý (*)
              </label>
              <input
                type="text"
                value={maQuanLy}
                onChange={(e) => setMaQuanLy(e.target.value)}
                required
                placeholder={type === 'may_tinh' ? 'VD: PC-KKB-01' : type === 'may_in' ? 'VD: IN-KKB-01' : 'VD: MH-KKB-01'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {/* Khoa phòng */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Khoa Phòng (*)
              </label>
              <select
                value={khoaPhong}
                onChange={(e) => setKhoaPhong(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Type specific fields */}
          {type === 'may_tinh' && (
            <>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Cấu Hình CPU / Chip / Ổ Cứng
                </label>
                <input
                  type="text"
                  value={cauHinh}
                  onChange={(e) => setCauHinh(e.target.value)}
                  placeholder="VD: Intel Core i5-11400 / SSD NVMe 512GB"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dung Lượng RAM</label>
                  <input
                    type="text"
                    value={ram}
                    onChange={(e) => setRam(e.target.value)}
                    placeholder="VD: 8GB DDR4 hoặc 16GB"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Gán Màn Hình Máy Tính
                  </label>
                  <select
                    value={maManHinh}
                    onChange={(e) => setMaManHinh(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
                  >
                    <option value="">-- Chọn Màn Hình (Tự chọn hoặc bỏ trống) --</option>
                    {monitorsList.map((m) => (
                      <option key={m.id} value={m.maQuanLy}>
                        [{m.maQuanLy}] {m.ten} ({m.khoaPhong})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vị Trí Sử Dụng</label>
                <input
                  type="text"
                  value={viTriSuDung}
                  onChange={(e) => setViTriSuDung(e.target.value)}
                  placeholder="VD: Bàn tiếp nhận bệnh nhân số 2 - Tầng 1"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </>
          )}

          {(type === 'may_in' || type === 'man_hinh') && (
            <div>
              <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
                {type === 'may_in' ? 'Tên Máy In (*)' : 'Tên Màn Hình (*)'}
              </label>
              <input
                type="text"
                value={ten}
                onChange={(e) => setTen(e.target.value)}
                required
                placeholder={type === 'may_in' ? 'VD: Canon LBP 2900 (In Laser)' : 'VD: Dell Professional P2419H 24"'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          )}

          {(type === 'may_tinh' || type === 'may_in') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Năm Sử Dụng</label>
                <input
                  type="number"
                  value={namSuDung}
                  onChange={(e) => setNamSuDung(Number(e.target.value))}
                  placeholder="VD: 2021"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nguyên Giá (VNĐ)</label>
                <input
                  type="number"
                  value={nguyenGia}
                  onChange={(e) => setNguyenGia(Number(e.target.value))}
                  placeholder="VD: 14500000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          {type === 'man_hinh' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ghi Chú Màn Hình</label>
              <input
                type="text"
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
                placeholder="VD: Hoạt động tốt, cổng kết nối HDMI/VGA..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          )}

          {/* Tình Trạng */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Tình Trạng Sử Dụng (*)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                  tinhTrang === 'hoat_dong'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="tinhTrang"
                  value="hoat_dong"
                  checked={tinhTrang === 'hoat_dong'}
                  onChange={() => setTinhTrang('hoat_dong')}
                  className="sr-only"
                />
                🟢 Hoạt động
              </label>

              <label
                className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                  tinhTrang === 'hu_hong'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="tinhTrang"
                  value="hu_hong"
                  checked={tinhTrang === 'hu_hong'}
                  onChange={() => setTinhTrang('hu_hong')}
                  className="sr-only"
                />
                🟡 Đã hư hỏng
              </label>

              <label
                className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                  tinhTrang === 'thanh_ly'
                    ? 'bg-slate-200 border-slate-400 text-slate-800 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="tinhTrang"
                  value="thanh_ly"
                  checked={tinhTrang === 'thanh_ly'}
                  onChange={() => setTinhTrang('thanh_ly')}
                  className="sr-only"
                />
                🔴 Đã thanh lý
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{editingItem ? 'Lưu Thay Đổi' : 'Thêm Mới Thiết Bị'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
