import React from 'react';
import { HardDrive, Wrench, FileSpreadsheet, Edit, Trash2, Monitor as MonitorIcon, Cpu, Calendar, DollarSign, MapPin } from 'lucide-react';
import { Computer, Monitor } from '../types';
import { formatCurrency, STATUS_LABELS } from '../utils/excelHelpers';

interface ComputerListProps {
  computers: Computer[];
  monitors: Monitor[];
  onEdit: (computer: Computer) => void;
  onDelete: (id: string) => void;
  onOpenRepairModal: (computer: Computer) => void;
  onExportSingleReport: (computer: Computer) => void;
}

export const ComputerList: React.FC<ComputerListProps> = ({
  computers,
  monitors,
  onEdit,
  onDelete,
  onOpenRepairModal,
  onExportSingleReport,
}) => {
  // Helper to find monitor name by maManHinh
  const getMonitorInfo = (maManHinh: string) => {
    if (!maManHinh) return null;
    return monitors.find((m) => m.maQuanLy.toLowerCase() === maManHinh.toLowerCase());
  };

  if (computers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <HardDrive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-700">Chưa có máy tính nào</h3>
        <p className="text-xs text-slate-500 mt-1">Không tìm thấy máy tính phù hợp với bộ lọc hiện tại.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Danh Sách Máy Tính ({computers.length})
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Hiển thị đầy đủ cấu hình, màn hình gán & lịch sử sửa chữa
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">Mã Quản Lý</th>
              <th className="py-3 px-4">Khoa Phòng / Vị Trí</th>
              <th className="py-3 px-4">Cấu Hình & RAM</th>
              <th className="py-3 px-4">Màn Hình Gán</th>
              <th className="py-3 px-4">Năm SD / Giá</th>
              <th className="py-3 px-4 text-center">Tình Trạng</th>
              <th className="py-3 px-4 text-center">Sửa Chữa</th>
              <th className="py-3 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 text-xs text-slate-700">
            {computers.map((comp) => {
              const mappedMon = getMonitorInfo(comp.maManHinh);
              const totalRepairCount = comp.lichSuSuaChua.length;

              return (
                <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Mã Quản Lý */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                    <span className="bg-blue-50 text-blue-800 px-2 py-1 rounded-md border border-blue-200/60 inline-block">
                      {comp.maQuanLy}
                    </span>
                  </td>

                  {/* Khoa Phòng & Vị Trí */}
                  <td className="py-3.5 px-4 max-w-[200px]">
                    <div className="font-semibold text-slate-800">{comp.khoaPhong}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate" title={comp.viTriSuDung}>
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{comp.viTriSuDung || 'Chưa ghi vị trí'}</span>
                    </div>
                  </td>

                  {/* Cấu Hình & RAM */}
                  <td className="py-3.5 px-4 max-w-[240px]">
                    <div className="font-medium text-slate-800 flex items-start gap-1">
                      <Cpu className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2" title={comp.cauHinh}>{comp.cauHinh || 'Chưa có cấu hình'}</span>
                    </div>
                    {comp.ram && (
                      <div className="mt-1">
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                          RAM: {comp.ram}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Màn Hình Gán */}
                  <td className="py-3.5 px-4 max-w-[180px]">
                    {comp.maManHinh ? (
                      <div className="bg-purple-50/70 p-1.5 rounded-lg border border-purple-200/60 text-[11px]">
                        <div className="font-bold text-purple-900 flex items-center gap-1">
                          <MonitorIcon className="w-3 h-3 text-purple-600" />
                          <span>{comp.maManHinh}</span>
                        </div>
                        <div className="text-[10px] text-purple-700 truncate mt-0.5" title={mappedMon ? mappedMon.ten : 'Không rõ tên'}>
                          {mappedMon ? mappedMon.ten : 'Chưa tìm thấy tên MH'}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Chưa gán MH</span>
                    )}
                  </td>

                  {/* Năm SD / Nguyên Giá */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-700 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{comp.namSuDung}</span>
                    </div>
                    <div className="text-slate-900 font-bold mt-0.5">
                      {formatCurrency(comp.nguyenGia)}
                    </div>
                  </td>

                  {/* Tình Trạng */}
                  <td className="py-3.5 px-4 text-center">
                    {comp.tinhTrang === 'hoat_dong' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Hoạt động
                      </span>
                    )}
                    {comp.tinhTrang === 'hu_hong' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Đã hư hỏng
                      </span>
                    )}
                    {comp.tinhTrang === 'thanh_ly' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-200 text-slate-700 border border-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                        Đã thanh lý
                      </span>
                    )}
                  </td>

                  {/* Sửa Chữa Button */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onOpenRepairModal(comp)}
                      className={`inline-flex items-center gap-1.5 p-1.5 px-2.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                        totalRepairCount > 0
                          ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                      title="Xem và ghi lịch sử sửa chữa"
                    >
                      <Wrench className={`w-3.5 h-3.5 ${totalRepairCount > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
                      <span>{totalRepairCount} lần</span>
                    </button>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {/* Export Single Machine History */}
                      <button
                        onClick={() => onExportSingleReport(comp)}
                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Xuất file Excel thông tin máy tính này (gồm lịch sử sửa chữa)"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onEdit(comp)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Chỉnh sửa thông tin máy tính"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDelete(comp.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa máy tính"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
