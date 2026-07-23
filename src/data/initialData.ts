import { Computer, Monitor, Printer } from '../types';

export const INITIAL_MONITORS: Monitor[] = [
  {
    id: 'mh-01',
    ten: 'Dell Professional P2419H 24" IPS',
    khoaPhong: 'Khoa Khám bệnh',
    maQuanLy: 'MH-KKB-01',
    tinhTrang: 'hoat_dong',
    ghiChu: 'Hoạt động tốt',
  },
  {
    id: 'mh-02',
    ten: 'Dell UltraSharp U2422H 23.8"',
    khoaPhong: 'Khoa Khám bệnh',
    maQuanLy: 'MH-KKB-02',
    tinhTrang: 'hoat_dong',
    ghiChu: 'Hoạt động tốt',
  },
  {
    id: 'mh-03',
    ten: 'HP EliteDisplay E243 23.8"',
    khoaPhong: 'Khoa Hồi sức tích cực - chống độc',
    maQuanLy: 'MH-KCC-01',
    tinhTrang: 'hoat_dong',
    ghiChu: 'Màn hình trực ca 24/7',
  },
  {
    id: 'mh-04',
    ten: 'LG 24MP88HV-S 23.8" Full HD',
    khoaPhong: 'Phòng Tài chính kế toán',
    maQuanLy: 'MH-KT-01',
    tinhTrang: 'hoat_dong',
    ghiChu: 'Hoạt động bình thường',
  },
  {
    id: 'mh-05',
    ten: 'Samsung S24R350 24" IPS 75Hz',
    khoaPhong: 'Khoa Dược',
    maQuanLy: 'MH-KD-01',
    tinhTrang: 'hu_hong',
    ghiChu: 'Bị sọc màn hình, chờ bảo hành',
  },
  {
    id: 'mh-06',
    ten: 'ViewSonic VA2261-2 21.5"',
    khoaPhong: 'Phòng Tổ chức nhân sự',
    maQuanLy: 'MH-TCHC-01',
    tinhTrang: 'thanh_ly',
    ghiChu: 'Hỏng nguồn, đã làm thủ tục thanh lý',
  }
];

export const INITIAL_COMPUTERS: Computer[] = [
  {
    id: 'pc-01',
    maQuanLy: 'PC-KKB-01',
    cauHinh: 'Intel Core i5-10400 / SSD NVMe 256GB / Mainboard H410',
    ram: '8GB DDR4 2666MHz',
    viTriSuDung: 'Bàn tiếp nhận bệnh nhân số 1',
    khoaPhong: 'Khoa Khám bệnh',
    maManHinh: 'MH-KKB-01',
    namSuDung: 2021,
    nguyenGia: 14500000,
    tinhTrang: 'hoat_dong',
    lichSuSuaChua: [
      {
        id: 'rep-pc-01',
        ngaySua: '2023-05-12',
        noiDung: 'Thay ổ cứng SSD 256GB hỏng cơ',
        chiPhi: 850000,
        donViSua: 'Công ty CNTT Phong Vũ',
      },
      {
        id: 'rep-pc-02',
        ngaySua: '2024-02-18',
        noiDung: 'Vệ sinh tra keo tản nhiệt, cài lại Windows 10 Pro',
        chiPhi: 200000,
        donViSua: 'Tổ CNTT',
      }
    ]
  },
  {
    id: 'pc-02',
    maQuanLy: 'PC-KKB-02',
    cauHinh: 'Intel Core i3-12100 / SSD 512GB',
    ram: '16GB DDR4 3200MHz',
    viTriSuDung: 'Phòng khám Ngoại số 3',
    khoaPhong: 'Khoa Khám bệnh',
    maManHinh: 'MH-KKB-02',
    namSuDung: 2022,
    nguyenGia: 12800000,
    tinhTrang: 'hoat_dong',
    lichSuSuaChua: []
  },
  {
    id: 'pc-03',
    maQuanLy: 'PC-KCC-01',
    cauHinh: 'Intel Core i7-11700 / SSD 512GB',
    ram: '16GB DDR4 3200MHz',
    viTriSuDung: 'Bàn điều dưỡng trực Cấp Cứu',
    khoaPhong: 'Khoa Hồi sức tích cực - chống độc',
    maManHinh: 'MH-KCC-01',
    namSuDung: 2021,
    nguyenGia: 18900000,
    tinhTrang: 'hoat_dong',
    lichSuSuaChua: [
      {
        id: 'rep-pc-03',
        ngaySua: '2023-11-05',
        noiDung: 'Thay nguồn Corsair CV550 bị sụt áp do điện chập',
        chiPhi: 1250000,
        donViSua: 'Trung tâm máy tính Bách Khoa',
      }
    ]
  },
  {
    id: 'pc-04',
    maQuanLy: 'PC-KT-01',
    cauHinh: 'Intel Core i5-11400 / SSD 512GB + HDD 1TB',
    ram: '16GB DDR4 3200MHz',
    viTriSuDung: 'Góc làm việc Kế toán trưởng',
    khoaPhong: 'Phòng Tài chính kế toán',
    maManHinh: 'MH-KT-01',
    namSuDung: 2020,
    nguyenGia: 16200000,
    tinhTrang: 'hoat_dong',
    lichSuSuaChua: [
      {
        id: 'rep-pc-04',
        ngaySua: '2022-08-20',
        noiDung: 'Nâng cấp thêm 1 thanh RAM 8GB và lắp thêm HDD 1TB dữ liệu',
        chiPhi: 1800000,
        donViSua: 'Tổ CNTT Bệnh Viện',
      }
    ]
  },
  {
    id: 'pc-05',
    maQuanLy: 'PC-KD-01',
    cauHinh: 'Intel Core i3-9100 / HDD 1TB',
    ram: '4GB DDR4 2400MHz',
    viTriSuDung: 'Quầy phát thuốc BHYT số 2',
    khoaPhong: 'Khoa Dược',
    maManHinh: 'MH-KD-01',
    namSuDung: 2019,
    nguyenGia: 9500000,
    tinhTrang: 'hu_hong',
    lichSuSuaChua: [
      {
        id: 'rep-pc-05',
        ngaySua: '2024-01-10',
        noiDung: 'Lỗi nạp BIOS Mainboard, máy treo liên tục khi mở PM Quản lý dược',
        chiPhi: 450000,
        donViSua: 'Cửa hàng Bệnh viện máy tính',
      }
    ]
  },
  {
    id: 'pc-06',
    maQuanLy: 'PC-TCHC-01',
    cauHinh: 'Intel Core 2 Duo E8400 / HDD 160GB',
    ram: '2GB DDR2',
    viTriSuDung: 'Kho tài liệu văn phòng',
    khoaPhong: 'Phòng Tổ chức nhân sự',
    maManHinh: 'MH-TCHC-01',
    namSuDung: 2012,
    nguyenGia: 7200000,
    tinhTrang: 'thanh_ly',
    lichSuSuaChua: [
      {
        id: 'rep-pc-06',
        ngaySua: '2021-03-15',
        noiDung: 'Thay tụ nguồn mainboard cũ',
        chiPhi: 150000,
        donViSua: 'Sửa chữa tự do',
      }
    ]
  }
];

export const INITIAL_PRINTERS: Printer[] = [
  {
    id: 'pr-01',
    ten: 'Canon LBP 2900 (In Laser trắng đen)',
    khoaPhong: 'Khoa Khám bệnh',
    maQuanLy: 'IN-KKB-01',
    namSuDung: 2019,
    nguyenGia: 3800000,
    tinhTrang: 'hoat_dong',
    lichSuSuaChua: [
      {
        id: 'rep-pr-01',
        ngaySua: '2023-04-10',
        noiDung: 'Thay bao lụa, rulo ép và nạp mực 12A',
        chiPhi: 350000,
        donViSua: 'Mực in Hồng Hà',
      },
      {
        id: 'rep-pr-02',
        ngaySua: '2024-01-15',
        noiDung: 'Thay hộp mực (Cartridge 303) mới',
        chiPhi: 480000,
        donViSua: 'Công ty An Phát',
      }
    ]
  },
  {
    id: 'pr-02',
    ten: 'HP LaserJet Pro M404dn (In đảo mặt tự động / LAN)',
    khoaPhong: 'Phòng Tài chính kế toán',
    maQuanLy: 'IN-KT-01',
    namSuDung: 2021,
    nguyenGia: 6500000,
    tinhTrang: 'hoat_dong',
    lichSuSuaChua: [
      {
        id: 'rep-pr-03',
        ngaySua: '2023-09-02',
        noiDung: 'Sửa kẹt giấy khay 2, thay bánh xe cao su kéo giấy',
        chiPhi: 250000,
        donViSua: 'Tổ CNTT',
      }
    ]
  },
  {
    id: 'pr-03',
    ten: 'Epson EcoTank L3210 (In màu đa năng)',
    khoaPhong: 'Phòng Tổ chức nhân sự',
    maQuanLy: 'IN-TCHC-01',
    namSuDung: 2022,
    nguyenGia: 4900000,
    tinhTrang: 'hoat_dong',
    lichSuSuaChua: []
  },
  {
    id: 'pr-04',
    ten: 'Canon LBP 6030w (In wifi)',
    khoaPhong: 'Khoa Hồi sức tích cực - chống độc',
    maQuanLy: 'IN-KCC-01',
    namSuDung: 2020,
    nguyenGia: 3200000,
    tinhTrang: 'hu_hong',
    lichSuSuaChua: [
      {
        id: 'rep-pr-04',
        ngaySua: '2024-03-01',
        noiDung: 'Cháy card formatter do nổ tụ điện',
        chiPhi: 900000,
        donViSua: 'Trung tâm bảo hành Canon',
      }
    ]
  },
  {
    id: 'pr-05',
    ten: 'HP LaserJet 1020',
    khoaPhong: 'Khoa Dược',
    maQuanLy: 'IN-KD-01',
    namSuDung: 2014,
    nguyenGia: 2900000,
    tinhTrang: 'thanh_ly',
    lichSuSuaChua: [
      {
        id: 'rep-pr-05',
        ngaySua: '2021-06-10',
        noiDung: 'Mòn bánh răng quay, hỏng cụm sấy không sửa được',
        chiPhi: 0,
        donViSua: 'Thanh lý theo biên bản',
      }
    ]
  }
];

export const DEPARTMENTS_LIST = [
  'Phòng Kế hoạch tổng hợp',
  'Phòng Tổ chức nhân sự',
  'Phòng Tài chính kế toán',
  'Phòng Điều dưỡng',
  'Phòng Quản lý chất lượng',
  'Phòng Vật tư - Thiết bị y tế',
  'Khoa Khám bệnh',
  'Khoa Hồi sức tích cực - chống độc',
  'Khoa Nội Tổng quát',
  'Khoa Nội tim mạch - lão khoa',
  'Khoa Lọc máu',
  'Khoa Ngoại thần kinh - chấn thương chỉnh hình',
  'Khoa Đơn nguyên ngoại thần kinh',
  'Khoa Ngoại tổng quát- lồng ngực',
  'Khoa Phụ sản',
  'Khoa Nhi',
  'Khoa Sơ sinh',
  'Khoa Truyền nhiễm',
  'Khoa THCT-VLTL-PHCN',
  'Khoa Phẫu thuật - gây mê hồi sức',
  'Khoa Tai - Mũi - Họng',
  'Khoa Răng - Hàm - Mặt',
  'Khoa Mắt',
  'Khoa Xét nghiệm',
  'Khoa Dinh dưỡng',
  'Khoa Chẩn đoán hình ảnh',
  'Khoa kiểm soát nhiễm khuẩn',
  'Khoa Dược'
];