import React from 'react';
import { Printer, Wrench, FileSpreadsheet, Edit, Trash2, Calendar, DollarSign, Tag } from 'lucide-react';
import { Printer as PrinterType } from '../types';
import { formatCurrency } from '../utils/excelHelpers';

interface PrinterListProps {
  printers: PrinterType[];
  onEdit: (printer: PrinterType) => void;
  onDelete: (id: string) => void;
  onOpenRepairModal: (printer: PrinterType) => void;
  onExportSingleReport: (printer: PrinterType) => void;
}

export const PrinterList: React.FC<PrinterListProps> = ({
  printers,
  onEdit,
  onDelete,
  onOpenRepairModal,
  onExportSingleReport,
}) => {
  if (printers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <Printer className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-700">Chưa có máy in nào</h3>
        <p className="text-xs text-slate-500 mt-1">Không tìm thấy máy in phù hợp với bộ lọc hiện tại.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Printer className="w-5 h-5 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Danh Sách Máy In ({printers.length})
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Hiển thị chi tiết tên, khoa phòng, nguyên giá & nhật ký sửa chữa
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">Mã Quản Lý</th>
              <th className="py-3 px-4">Tên Máy In</th>
              <th className="py-3 px-4">Khoa Phòng</th>
              <th className="py-3 px-4">Năm SD / Giá</th>
              <th className="py-3 px-4 text-center">Tình Trạng</th>
              <th className="py-3 px-4 text-center">Sửa Chữa</th>
              <th className="py-3 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 text-xs text-slate-700">
            {printers.map((pr) => {
              const totalRepairCount = pr.lichSuSuaChua.length;

              return (
                <tr key={pr.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Mã Quản Lý */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                    <span className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded-md border border-emerald-200/60 inline-block">
                      {pr.maQuanLy}
                    </span>
                  </td>

                  {/* Tên Máy In */}
                  <td className="py-3.5 px-4 max-w-[280px]">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{pr.ten}</span>
                    </div>
                  </td>

                  {/* Khoa Phòng */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{pr.khoaPhong}</span>
                  </td>

                  {/* Năm SD / Nguyên Giá */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-700 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{pr.namSuDung}</span>
                    </div>
                    <div className="text-slate-900 font-bold mt-0.5">
                      {formatCurrency(pr.nguyenGia)}
                    </div>
                  </td>

                  {/* Tình Trạng */}
                  <td className="py-3.5 px-4 text-center">
                    {pr.tinhTrang === 'hoat_dong' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Hoạt động
                      </span>
                    )}
                    {pr.tinhTrang === 'hu_hong' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Đã hư hỏng
                      </span>
                    )}
                    {pr.tinhTrang === 'thanh_ly' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-200 text-slate-700 border border-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                        Đã thanh lý
                      </span>
                    )}
                  </td>

                  {/* Sửa Chữa Button */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onOpenRepairModal(pr)}
                      className={`inline-flex items-center gap-1.5 p-1.5 px-2.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                        totalRepairCount > 0
                          ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                      title="Xem và ghi lịch sử sửa chữa máy in"
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
                        onClick={() => onExportSingleReport(pr)}
                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Xuất file Excel thông tin máy in này (gồm lịch sử sửa chữa)"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onEdit(pr)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Chỉnh sửa thông tin máy in"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDelete(pr.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa máy in"
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
