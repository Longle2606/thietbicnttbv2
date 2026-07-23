export type EquipmentStatus = 'hoat_dong' | 'hu_hong' | 'thanh_ly';

export interface RepairRecord {
  id: string;
  ngaySua: string; // YYYY-MM-DD
  noiDung: string;
  chiPhi: number; // VNĐ
  donViSua: string;
}

export interface Monitor {
  id: string;
  ten: string;
  khoaPhong: string;
  maQuanLy: string;
  tinhTrang: EquipmentStatus;
  ghiChu?: string;
  ngayTao?: string;
}

export interface Computer {
  id: string;
  maQuanLy: string;
  cauHinh: string;
  ram: string;
  viTriSuDung: string;
  khoaPhong: string;
  maManHinh: string; // Map từ Mã Quản Lý của Màn Hình
  namSuDung: number;
  nguyenGia: number; // VNĐ
  tinhTrang: EquipmentStatus;
  lichSuSuaChua: RepairRecord[];
}

export interface Printer {
  id: string;
  ten: string;
  khoaPhong: string;
  maQuanLy: string;
  namSuDung: number;
  nguyenGia: number; // VNĐ
  tinhTrang: EquipmentStatus;
  lichSuSuaChua: RepairRecord[];
}

export interface DepartmentSummary {
  khoaPhong: string;
  soLuongMayTinh: number;
  soLuongMayIn: number;
  soLuongManHinh: number;
  tongNguyenGia: number;
  tongSuaChua: number;
}

export interface UserSession {
  username: string;
  role: string;
  isLoggedIn: boolean;
}
