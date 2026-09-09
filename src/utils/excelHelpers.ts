import * as XLSX from 'xlsx';
import { Computer, EquipmentStatus, Monitor, Printer, RepairRecord } from '../types';

export const STATUS_LABELS: Record<EquipmentStatus, string> = {
  hoat_dong: 'Hoạt động',
  hu_hong: 'Đã hư hỏng',
  thanh_ly: 'Đã thanh lý',
};

export const parseStatusFromText = (text: string): EquipmentStatus => {
  if (!text) return 'hoat_dong';
  const str = text.toString().toLowerCase().trim();
  if (str.includes('hư') || str.includes('hỏng') || str.includes('hong')) return 'hu_hong';
  if (str.includes('thanh lý') || str.includes('thanh ly')) return 'thanh_ly';
  return 'hoat_dong';
};

export const formatCurrency = (amount: number): string => {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 VNĐ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

/**
 * Hàm hỗ trợ format danh sách sửa chữa thành chuỗi xuống dòng kèm STT, Ngày, Nội dung, Chi phí
 */
export const formatRepairHistoryText = (repairs?: RepairRecord[]): string => {
  if (!repairs || repairs.length === 0) {
    return 'Chưa có lịch sử sửa chữa';
  }

  return repairs
    .map((item, index) => {
      const ngayFormatted = item.ngay
        ? item.ngay.split('-').reverse().join('/')
        : 'N/A';
      const giaFormatted = item.chiPhi
        ? `${item.chiPhi.toLocaleString('vi-VN')}đ`
        : '0đ';

      return `${index + 1}. [${ngayFormatted}]: ${item.noiDung} (${giaFormatted})`;
    })
    .join('\n'); // Xuống dòng cho mỗi lần sửa chữa
};

// 1. TẢI FILE MẪU EXCEL
export const downloadTemplate = (type: 'man_hinh' | 'may_tinh' | 'may_in') => {
  const wb = XLSX.utils.book_new();

  if (type === 'man_hinh') {
    const headers = ['Mã Quản Lý (*)', 'Tên Màn Hình (*)', 'Khoa Phòng (*)', 'Tình Trạng (Hoạt động/Đã hư hỏng/Đã thanh lý)', 'Ghi Chú'];
    const sampleRows = [
      ['MH-KKB-03', 'Dell P2419H 24" IPS', 'Khoa Khám Bệnh', 'Hoạt động', 'Mới nhập'],
      ['MH-KCC-02', 'HP EliteDisplay E243 23.8"', 'Khoa Cấp Cứu', 'Hoạt động', 'Sử dụng phòng trực'],
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
    ws['!cols'] = [{ wch: 18 }, { wch: 30 }, { wch: 22 }, { wch: 25 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Mau_Nhap_ManHinh');
    XLSX.writeFile(wb, 'Mau_Nhap_ManHinh.xlsx');
  } else if (type === 'may_tinh') {
    const headers = [
      'Mã Quản Lý (*)',
      'Cấu Hình',
      'RAM',
      'Vị Trí Sử Dụng',
      'Khoa Phòng (*)',
      'Mã Màn Hình (Map với Mã QL Màn Hình)',
      'Năm Sử Dụng',
      'Nguyên Giá (VNĐ)',
      'Tình Trạng (Hoạt động/Đã hư hỏng/Đã thanh lý)'
    ];
    const sampleRows = [
      ['PC-KKB-05', 'Intel Core i5-11400 / SSD 512GB', '16GB DDR4', 'Bàn số 3 - Phòng Khám Ngoại', 'Khoa Khám Bệnh', 'MH-KKB-03', 2022, 13500000, 'Hoạt động'],
      ['PC-KCC-03', 'Intel Core i7-12700 / SSD 512GB', '16GB DDR4', 'Bàn trực điều dưỡng', 'Khoa Cấp Cứu', 'MH-KCC-02', 2023, 17800000, 'Hoạt động'],
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
    ws['!cols'] = [{ wch: 16 }, { wch: 38 }, { wch: 14 }, { wch: 30 }, { wch: 22 }, { wch: 22 }, { wch: 14 }, { wch: 18 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Mau_Nhap_MayTinh');
    XLSX.writeFile(wb, 'Mau_Nhap_MayTinh.xlsx');
  } else if (type === 'may_in') {
    const headers = [
      'Mã Quản Lý (*)',
      'Tên Máy In (*)',
      'Khoa Phòng (*)',
      'Năm Sử Dụng',
      'Nguyên Giá (VNĐ)',
      'Tình Trạng (Hoạt động/Đã hư hỏng/Đã thanh lý)'
    ];
    const sampleRows = [
      ['IN-KKB-03', 'Canon LBP 2900 (Laser trắng đen)', 'Khoa Khám Bệnh', 2021, 4100000, 'Hoạt động'],
      ['IN-KT-02', 'HP LaserJet Pro M404dn', 'Phòng Kế Toán', 2022, 6800000, 'Hoạt động'],
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
    ws['!cols'] = [{ wch: 16 }, { wch: 35 }, { wch: 22 }, { wch: 14 }, { wch: 18 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Mau_Nhap_MayIn');
    XLSX.writeFile(wb, 'Mau_Nhap_MayIn.xlsx');
  }
};

// 2. NHẬP FILE EXCEL (PARSER)
export interface ParsedImportResult {
  monitors: Partial<Monitor>[];
  computers: Partial<Computer>[];
  printers: Partial<Printer>[];
  errors: string[];
}

export const parseExcelFile = async (file: File, type: 'man_hinh' | 'may_tinh' | 'may_in'): Promise<ParsedImportResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' });

        const result: ParsedImportResult = {
          monitors: [],
          computers: [],
          printers: [],
          errors: []
        };

        if (!jsonRows || jsonRows.length === 0) {
          result.errors.push('File Excel không có dữ liệu!');
          return resolve(result);
        }

        jsonRows.forEach((row, idx) => {
          const rowNum = idx + 2;

          if (type === 'man_hinh') {
            const maQuanLy = (row['Mã Quản Lý (*)'] || row['Mã Quản Lý'] || row['Mã quản lý'] || row['MA_QUAN_LY'] || '').toString().trim();
            const ten = (row['Tên Màn Hình (*)'] || row['Tên Màn Hình'] || row['Tên màn hình'] || row['TEN'] || '').toString().trim();
            const khoaPhong = (row['Khoa Phòng (*)'] || row['Khoa Phòng'] || row['Khoa phòng'] || row['KHOA_PHONG'] || '').toString().trim();
            const tinhTrangText = row['Tình Trạng (Hoạt động/Đã hư hỏng/Đã thanh lý)'] || row['Tình Trạng'] || row['Tình trạng'] || 'Hoạt động';
            const ghiChu = (row['Ghi Chú'] || row['Ghi chú'] || '').toString().trim();

            if (!maQuanLy || !ten || !khoaPhong) {
              result.errors.push(`Dòng ${rowNum}: Thiếu thông tin bắt buộc (Mã quản lý, Tên, hoặc Khoa phòng)`);
            } else {
              result.monitors.push({
                maQuanLy,
                ten,
                khoaPhong,
                tinhTrang: parseStatusFromText(tinhTrangText),
                ghiChu
              });
            }
          } else if (type === 'may_tinh') {
            const maQuanLy = (row['Mã Quản Lý (*)'] || row['Mã Quản Lý'] || row['Mã quản lý'] || row['MA_QUAN_LY'] || '').toString().trim();
            const cauHinh = (row['Cấu Hình'] || row['Cấu hình'] || '').toString().trim();
            const ram = (row['RAM'] || row['Ram'] || '').toString().trim();
            const viTriSuDung = (row['Vị Trí Sử Dụng'] || row['Vị trí sử dụng'] || '').toString().trim();
            const khoaPhong = (row['Khoa Phòng (*)'] || row['Khoa Phòng'] || row['Khoa phòng'] || '').toString().trim();
            const maManHinh = (row['Mã Màn Hình (Map với Mã QL Màn Hình)'] || row['Mã Màn Hình'] || row['Mã màn hình'] || '').toString().trim();
            const namSuDung = parseInt(row['Năm Sử Dụng'] || row['Năm sử dụng'] || '2023', 10) || new Date().getFullYear();
            const nguyenGia = parseFloat((row['Nguyên Giá (VNĐ)'] || row['Nguyên Giá'] || row['Nguyên giá'] || '0').toString().replace(/[^0-9]/g, '')) || 0;
            const tinhTrangText = row['Tình Trạng (Hoạt động/Đã hư hỏng/Đã thanh lý)'] || row['Tình Trạng'] || row['Tình trạng'] || 'Hoạt động';

            if (!maQuanLy || !khoaPhong) {
              result.errors.push(`Dòng ${rowNum}: Thiếu Mã quản lý hoặc Khoa phòng`);
            } else {
              result.computers.push({
                maQuanLy,
                cauHinh,
                ram,
                viTriSuDung,
                khoaPhong,
                maManHinh,
                namSuDung,
                nguyenGia,
                tinhTrang: parseStatusFromText(tinhTrangText),
                lichSuSuaChua: []
              });
            }
          } else if (type === 'may_in') {
            const maQuanLy = (row['Mã Quản Lý (*)'] || row['Mã Quản Lý'] || row['Mã quản lý'] || '').toString().trim();
            const ten = (row['Tên Máy In (*)'] || row['Tên Máy In'] || row['Tên máy in'] || '').toString().trim();
            const khoaPhong = (row['Khoa Phòng (*)'] || row['Khoa Phòng'] || row['Khoa phòng'] || '').toString().trim();
            const namSuDung = parseInt(row['Năm Sử Dụng'] || row['Năm sử dụng'] || '2023', 10) || new Date().getFullYear();
            const nguyenGia = parseFloat((row['Nguyên Giá (VNĐ)'] || row['Nguyên Giá'] || row['Nguyên giá'] || '0').toString().replace(/[^0-9]/g, '')) || 0;
            const tinhTrangText = row['Tình Trạng (Hoạt động/Đã hư hỏng/Đã thanh lý)'] || row['Tình Trạng'] || row['Tình trạng'] || 'Hoạt động';

            if (!maQuanLy || !ten || !khoaPhong) {
              result.errors.push(`Dòng ${rowNum}: Thiếu thông tin bắt buộc (Mã quản lý, Tên máy in, hoặc Khoa phòng)`);
            } else {
              result.printers.push({
                maQuanLy,
                ten,
                khoaPhong,
                namSuDung,
                nguyenGia,
                tinhTrang: parseStatusFromText(tinhTrangText),
                lichSuSuaChua: []
              });
            }
          }
        });

        resolve(result);
      } catch (err: any) {
        resolve({
          monitors: [],
          computers: [],
          printers: [],
          errors: ['Lỗi đọc file Excel: ' + (err.message || 'Cấu trúc file không hợp lệ')]
        });
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

// 3. XUẤT TẤT CẢ HOẶC THEO KHOA PHÒNG RA EXCEL
export const exportEquipmentToExcel = (
  computers: Computer[],
  printers: Printer[],
  monitors: Monitor[],
  departmentFilter: string = 'all'
) => {
  const isAll = departmentFilter === 'all';
  const filteredComputers = isAll ? computers : computers.filter(c => c.khoaPhong === departmentFilter);
  const filteredPrinters = isAll ? printers : printers.filter(p => p.khoaPhong === departmentFilter);
  const filteredMonitors = isAll ? monitors : monitors.filter(m => m.khoaPhong === departmentFilter);

  const wb = XLSX.utils.book_new();

  // Sheet 1: Máy Tính
  const computerRows = filteredComputers.map((c, idx) => {
    const repairs = c.lichSuSuaChua || [];
    return {
      'STT': idx + 1,
      'Mã Quản Lý': c.maQuanLy,
      'Khoa Phòng': c.khoaPhong,
      'Vị Trí Sử Dụng': c.viTriSuDung,
      'Cấu Hình': c.cauHinh,
      'RAM': c.ram,
      'Mã Màn Hình Gán': c.maManHinh || 'Không có',
      'Năm Sử Dụng': c.namSuDung,
      'Nguyên Giá (VNĐ)': c.nguyenGia,
      'Tình Trạng': STATUS_LABELS[c.tinhTrang],
      'Số Lần Sửa Chữa': repairs.length,
      'Lịch Sử Sửa Chữa Chi Tiết': formatRepairHistoryText(repairs),
    };
  });
  const wsComputers = XLSX.utils.json_to_sheet(computerRows);
  wsComputers['!cols'] = [
    { wch: 6 }, { wch: 15 }, { wch: 22 }, { wch: 28 }, { wch: 38 }, { wch: 14 },
    { wch: 18 }, { wch: 14 }, { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 65 }
  ];
  XLSX.utils.book_append_sheet(wb, wsComputers, 'Danh Sách Máy Tính');

  // Sheet 2: Máy In
  const printerRows = filteredPrinters.map((p, idx) => {
    const repairs = p.lichSuSuaChua || [];
    return {
      'STT': idx + 1,
      'Mã Quản Lý': p.maQuanLy,
      'Tên Máy In': p.ten,
      'Khoa Phòng': p.khoaPhong,
      'Năm Sử Dụng': p.namSuDung,
      'Nguyên Giá (VNĐ)': p.nguyenGia,
      'Tình Trạng': STATUS_LABELS[p.tinhTrang],
      'Số Lần Sửa Chữa': repairs.length,
      'Lịch Sử Sửa Chữa Chi Tiết': formatRepairHistoryText(repairs),
    };
  });
  const wsPrinters = XLSX.utils.json_to_sheet(printerRows);
  wsPrinters['!cols'] = [
    { wch: 6 }, { wch: 15 }, { wch: 32 }, { wch: 22 }, { wch: 14 },
    { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 65 }
  ];
  XLSX.utils.book_append_sheet(wb, wsPrinters, 'Danh Sách Máy In');

  // Sheet 3: Màn Hình
  const monitorRows = filteredMonitors.map((m, idx) => ({
    'STT': idx + 1,
    'Mã Quản Lý': m.maQuanLy,
    'Tên Màn Hình': m.ten,
    'Khoa Phòng': m.khoaPhong,
    'Tình Trạng': STATUS_LABELS[m.tinhTrang],
    'Ghi Chú': m.ghiChu || ''
  }));
  const wsMonitors = XLSX.utils.json_to_sheet(monitorRows);
  wsMonitors['!cols'] = [{ wch: 6 }, { wch: 16 }, { wch: 32 }, { wch: 22 }, { wch: 16 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsMonitors, 'Danh Sách Màn Hình');

  // Sheet 4: Lịch Sử Sửa Chữa Tổng Hợp
  const allRepairRows: any[] = [];
  filteredComputers.forEach(c => {
    (c.lichSuSuaChua || []).forEach((r, idx) => {
      allRepairRows.push({
        'Loại Thiết Bị': 'Máy tính',
        'Mã Quản Lý': c.maQuanLy,
        'Tên / Cấu Hình': c.cauHinh,
        'Khoa Phòng': c.khoaPhong,
        'STT Lần Sửa': idx + 1,
        'Ngày Sửa Chữa': r.ngay ? r.ngay.split('-').reverse().join('/') : '',
        'Nội Dung Sửa Chữa': r.noiDung,
        'Chi Phí (VNĐ)': r.chiPhi || 0
      });
    });
  });
  filteredPrinters.forEach(p => {
    (p.lichSuSuaChua || []).forEach((r, idx) => {
      allRepairRows.push({
        'Loại Thiết Bị': 'Máy in',
        'Mã Quản Lý': p.maQuanLy,
        'Tên / Cấu Hình': p.ten,
        'Khoa Phòng': p.khoaPhong,
        'STT Lần Sửa': idx + 1,
        'Ngày Sửa Chữa': r.ngay ? r.ngay.split('-').reverse().join('/') : '',
        'Nội Dung Sửa Chữa': r.noiDung,
        'Chi Phí (VNĐ)': r.chiPhi || 0
      });
    });
  });

  if (allRepairRows.length > 0) {
    const wsRepairs = XLSX.utils.json_to_sheet(allRepairRows);
    wsRepairs['!cols'] = [
      { wch: 14 }, { wch: 16 }, { wch: 35 }, { wch: 22 }, { wch: 12 }, { wch: 16 }, { wch: 45 }, { wch: 18 }
    ];
    XLSX.utils.book_append_sheet(wb, wsRepairs, 'Lịch Sử Sửa Chữa');
  }

  const fileName = isAll
    ? `BaoCao_ThietBi_TatCaKhoa_${new Date().toISOString().slice(0, 10)}.xlsx`
    : `BaoCao_ThietBi_${departmentFilter.replace(/[\s/]/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;

  XLSX.writeFile(wb, fileName);
};

// 4. XUẤT CHI TIẾT 1 MÁY TÍNH HOẶC MÁY IN (BÁO CÁO ĐƠN LẺ)
export const exportSingleDeviceReport = (
  device: Computer | Printer,
  deviceType: 'may_tinh' | 'may_in',
  mappedMonitor?: Monitor
) => {
  const wb = XLSX.utils.book_new();

  const titleRow = [
    [`BÁO CÁO THÔNG TIN CHI TIẾT VÀ LỊCH SỬ SỬA CHỮA THIẾT BỊ`],
    [`Ngày xuất báo cáo: ${new Date().toLocaleDateString('vi-VN')}`],
    []
  ];

  let specRows: any[][] = [];
  if (deviceType === 'may_tinh') {
    const comp = device as Computer;
    specRows = [
      ['I. THÔNG TIN THIẾT BỊ MÁY TÍNH'],
      ['Mã quản lý:', comp.maQuanLy, 'Tình trạng sử dụng:', STATUS_LABELS[comp.tinhTrang]],
      ['Khoa phòng:', comp.khoaPhong, 'Vị trí sử dụng:', comp.viTriSuDung],
      ['Cấu hình CPU/Specs:', comp.cauHinh, 'RAM:', comp.ram],
      ['Màn hình gán (Mã QL):', comp.maManHinh || 'Không gán', 'Tên Màn Hình:', mappedMonitor ? mappedMonitor.ten : 'N/A'],
      ['Năm bắt đầu sử dụng:', comp.namSuDung, 'Nguyên giá (VNĐ):', comp.nguyenGia],
      []
    ];
  } else {
    const pr = device as Printer;
    specRows = [
      ['I. THÔNG TIN THIẾT BỊ MÁY IN'],
      ['Mã quản lý:', pr.maQuanLy, 'Tình trạng sử dụng:', STATUS_LABELS[pr.tinhTrang]],
      ['Tên máy in:', pr.ten, 'Khoa phòng:', pr.khoaPhong],
      ['Năm bắt đầu sử dụng:', pr.namSuDung, 'Nguyên giá (VNĐ):', pr.nguyenGia],
      []
    ];
  }

  const repairHeader = [
    ['II. LỊCH SỬ BẢO TRÌ - SỬA CHỮA'],
    ['STT', 'Ngày sửa chữa', 'Nội dung công việc sửa chữa / thay thế', 'Chi phí (VNĐ)']
  ];

  const repairs = device.lichSuSuaChua || [];
  const repairData = repairs.map((r, idx) => [
    idx + 1,
    r.ngay ? r.ngay.split('-').reverse().join('/') : '',
    r.noiDung,
    r.chiPhi ? `${r.chiPhi.toLocaleString('vi-VN')} đ` : '0 đ'
  ]);

  const finalRows = [
    ...titleRow,
    ...specRows,
    ...repairHeader,
    ...(repairData.length > 0 ? repairData : [['-', '-', 'Chưa có lịch sử sửa chữa nào', '-']])
  ];

  const ws = XLSX.utils.aoa_to_sheet(finalRows);
  ws['!cols'] = [{ wch: 8 }, { wch: 18 }, { wch: 50 }, { wch: 20 }];

  XLSX.utils.book_append_sheet(wb, ws, 'ThongTinThietBi');
  XLSX.writeFile(wb, `ChiTiet_${device.maQuanLy}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};