
const supabaseUrl = 'https://vmfofrwqnzgrtfcrkgev.supabase.co';
const supabaseKey = 'sb_publishable_BwCEBS9lJPizFAeYc4PZRg_UXgWVuTa';

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Dữ liệu mặc định khi chưa tải được từ Supabase
let SITE_DATA = {
  music: new Array(30).fill(null),
  video: new Array(30).fill(null),
  photo: new Array(30).fill(null),
  caption: new Array(30).fill(null),
};

// Tải dữ liệu mới nhất từ Supabase — ai mở trang cũng thấy bản mới nhất
async function loadSiteData() {
  const { data, error } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Lỗi tải dữ liệu:', error);
    return;
  }
  SITE_DATA = data.data;
  renderPage(); // hàm vẽ lại trang của bạn, gọi sau khi có dữ liệu
}
// Đăng nhập
async function adminLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert('Sai email hoặc mật khẩu');
    return false;
  }
  return true;
}

// Lưu nội dung mới — chỉ chạy được nếu đã đăng nhập (nhờ RLS)
async function saveSiteData() {
  const { error } = await supabase
    .from('site_content')
    .update({ data: SITE_DATA, updated_at: new Date() })
    .eq('id', 1);

  if (error) {
    alert('Lưu thất bại: ' + error.message);
  } else {
    alert('Đã lưu! Mọi người sẽ thấy thay đổi ngay.');
  }
}
