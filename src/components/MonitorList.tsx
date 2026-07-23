import React from 'react';
import { Monitor as MonitorIcon, Edit, Trash2, Tag, Info } from 'lucide-react';
import { Monitor } from '../types';

interface MonitorListProps {
  monitors: Monitor[];
  onEdit: (monitor: Monitor) => void;
  onDelete: (id: string) => void;
}

export const MonitorList: React.FC<MonitorListProps> = ({ monitors, onEdit, onDelete }) => {
  if (monitors.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <MonitorIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-700">Chưa có màn hình nào</h3>
        <p className="text-xs text-slate-500 mt-1">Không tìm thấy màn hình máy tính phù hợp với bộ lọc hiện tại.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MonitorIcon className="w-5 h-5 text-purple-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Danh Sách Màn Hình Máy Tính ({monitors.length})
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Mã quản lý màn hình được dùng để map gán với máy tính
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">Mã Quản Lý</th>
              <th className="py-3 px-4">Tên Màn Hình</th>
              <th className="py-3 px-4">Khoa Phòng</th>
              <th className="py-3 px-4">Ghi Chú</th>
              <th className="py-3 px-4 text-center">Tình Trạng</th>
              <th className="py-3 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 text-xs text-slate-700">
            {monitors.map((mon) => (
              <tr key={mon.id} className="hover:bg-slate-50/80 transition-colors">
                {/* Mã Quản Lý */}
                <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                  <span className="bg-purple-50 text-purple-800 px-2 py-1 rounded-md border border-purple-200/60 inline-block">
                    {mon.maQuanLy}
                  </span>
                </td>

                {/* Tên Màn Hình */}
                <td className="py-3.5 px-4 max-w-[280px]">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>{mon.ten}</span>
                  </div>
                </td>

                {/* Khoa Phòng */}
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-800">{mon.khoaPhong}</span>
                </td>

                {/* Ghi chú */}
                <td className="py-3.5 px-4 text-slate-600">
                  {mon.ghiChu ? (
                    <span className="flex items-center gap-1 text-[11px]">
                      <Info className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{mon.ghiChu}</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">Không có ghi chú</span>
                  )}
                </td>

                {/* Tình Trạng */}
                <td className="py-3.5 px-4 text-center">
                  {mon.tinhTrang === 'hoat_dong' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Hoạt động
                    </span>
                  )}
                  {mon.tinhTrang === 'hu_hong' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Đã hư hỏng
                    </span>
                  )}
                  {mon.tinhTrang === 'thanh_ly' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-200 text-slate-700 border border-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                      Đã thanh lý
                    </span>
                  )}
                </td>

                {/* Action Buttons */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => onEdit(mon)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Chỉnh sửa màn hình"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(mon.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa màn hình"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
