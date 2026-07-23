import { supabase } from './supabaseClient';
import { Computer, Printer, Monitor } from './types';

export type DeviceType = 'may_tinh' | 'may_in' | 'man_hinh';
export type DeviceItem = Computer | Printer | Monitor;

/**
 * 1. THÊM / CẬP NHẬT 1 THIẾT BỊ (Single Insert / Upsert)
 */
export const upsertSingleDevice = async (
  item: DeviceItem,
  type: DeviceType
) => {
  try {
    const payload = {
      id: item.id,
      type: type,
      data: item,
    };

    const { data, error } = await supabase
      .from('devices')
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Lỗi khi thêm thiết bị:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Lỗi kết nối Supabase:', err);
    return { success: false, error: err.message };
  }
};

/**
 * 2. THÊM NHIỀU THIẾT BỊ CÙNG LÚC (Batch Insert / Import Excel)
 */
export const batchUpsertDevices = async (
  items: DeviceItem[],
  type: DeviceType
) => {
  try {
    // Đóng gói danh sách thiết bị thành định dạng bảng Supabase (id, type, data)
    const payload = items.map((item) => ({
      id: item.id,
      type: type,
      data: item,
    }));

    // Chèn hàng loạt vào Supabase
    const { data, error } = await supabase
      .from('devices')
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Lỗi batch insert Supabase:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, count: payload.length, data };
  } catch (err: any) {
    console.error('Lỗi kết nối Supabase:', err);
    return { success: false, error: err.message };
  }
};