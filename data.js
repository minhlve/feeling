// ============================================================
// data.js — Cấu hình Supabase + các hàm tải/lưu dữ liệu
// File này CHỈ lo việc nói chuyện với Supabase. Việc hiển thị
// trang và quản lý trạng thái nằm bên app.js.
// ============================================================

const supabaseUrl = 'https://vmfofrwqnzgrtfcrkgev.supabase.co';
const supabaseKey = 'sb_publishable_BwCEBS9lJPizFAeYc4PZRg_UXgWVuTa';

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Dữ liệu mặc định, chỉ dùng để có gì đó hiện ra ngay trong lúc
// chờ tải xong từ Supabase (hoặc khi mất mạng / lỗi).
let SITE_DATA = {
  music: new Array(30).fill(null),
  video: new Array(30).fill(null),
  photo: new Array(30).fill(null),
  caption: new Array(30).fill(null),
};

// Tải dữ liệu mới nhất từ Supabase — ai mở trang cũng thấy bản mới nhất.
// Trả về dữ liệu nếu thành công, hoặc null nếu lỗi.
// (Không tự vẽ lại trang ở đây — app.js sẽ quyết định khi nào render.)
async function loadSiteData() {
  const { data, error } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Lỗi tải dữ liệu:', error);
    return null;
  }
  SITE_DATA = data.data;
  return SITE_DATA;
}

// Đăng nhập admin qua Supabase Auth (cần tạo sẵn 1 user trong
// Supabase > Authentication > Users, dùng email + mật khẩu đó).
// Trả về true/false — không tự alert, để app.js quyết định hiển thị gì.
async function adminLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return false;
  return true;
}

// Đăng xuất khỏi session Supabase (gọi kèm khi admin bấm Đăng xuất trên app)
async function adminLogout() {
  await supabase.auth.signOut();
}

// Lưu nội dung mới lên Supabase — chỉ thành công nếu đang đăng nhập
// admin (nhờ Row Level Security trên bảng site_content).
// content: object { music, video, photo, caption } cần lưu.
// Trả về true/false.
async function saveSiteData(content) {
  const { error } = await supabase
    .from('site_content')
    .update({ data: content, updated_at: new Date() })
    .eq('id', 1);

  if (error) {
    console.error('Lỗi lưu dữ liệu:', error);
    return false;
  }
  return true;
}
