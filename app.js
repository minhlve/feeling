/* ==========================================================
   app.js — Toàn bộ logic của "Hộp Ký Ức"
   Cấu hình + hàm gọi Supabase nằm ở js/data.js
========================================================== */

const SECTIONS = [
  { key: "music", label: "Trang chủ", sub: "Nhạc" },
  { key: "video", label: "Short Video", sub: "Video" },
  { key: "photo", label: "Sad Photos", sub: "Ảnh" },
  { key: "caption", label: "Caption", sub: "Chữ" },
];

const ICONS = {
  music: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  video: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>',
  photo: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>',
  caption: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-2 7-7V5H4v9h5c0 3-2 5-6 5"/><path d="M14 21c3 0 7-2 7-7V5h-6v9h5c0 3-2 5-6 5"/></svg>',
  user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  lock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  x: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  plus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  download: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>',
  copy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  fb: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>',
  share: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5 15.4 17.5M15.4 6.5 8.6 10.5"/></svg>',
  send: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4 20-7Z"/></svg>',
  pencil: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
  trash: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>',
  logout: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>',
  refresh: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v5h-5"/></svg>',
};

/* ---------------- helpers ---------------- */
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
const pad2 = (n) => String(n + 1).padStart(2, "0");
const isYoutube = (url = "") => /youtu\.?be/.test(url);
function ytId(url = "") {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}
const ytEmbed = (url) => (ytId(url) ? `https://www.youtube.com/embed/${ytId(url)}` : url);
const ytThumb = (url) => (ytId(url) ? `https://img.youtube.com/vi/${ytId(url)}/hqdefault.jpg` : null);
function sectionInfo(key) { return SECTIONS.find((s) => s.key === key); }

/* ---------------- persistence (trình duyệt) ---------------- */
// Tài khoản người xem thường (không phải admin) vẫn lưu trên máy —
// chỉ admin mới đăng nhập qua Supabase và dữ liệu nội dung mới
// đồng bộ qua Supabase.
function loadUsers() {
  try { return JSON.parse(localStorage.getItem("kyuc_users") || "[]"); } catch (e) { return []; }
}
function saveUsers(list) { localStorage.setItem("kyuc_users", JSON.stringify(list)); }

function loadSession() {
  try { return JSON.parse(localStorage.getItem("kyuc_session")); } catch (e) { return null; }
}
function saveSession(s) {
  if (s) localStorage.setItem("kyuc_session", JSON.stringify(s));
  else localStorage.removeItem("kyuc_session");
}

// Nội dung mặc định để hiện ngay trong lúc chờ tải từ Supabase.
function loadContent() {
  return JSON.parse(JSON.stringify(SITE_DATA));
}

/* ---------------- state ---------------- */
const state = {
  session: loadSession(),
  authView: "login",
  authError: "",
  tab: "music",
  content: loadContent(),
  openItem: null,
  editItem: null,
  syncing: false,
  toastMsg: "",
};

function showToast(msg) {
  state.toastMsg = msg;
  render();
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => { state.toastMsg = ""; render(); }, 2400);
}

/* ---------------- đồng bộ với Supabase ---------------- */
// Tải lại nội dung mới nhất từ Supabase và vẽ lại trang.
async function refreshFromCloud() {
  const fresh = await loadSiteData();
  if (fresh) {
    state.content = fresh;
    render();
  }
}

/* ---------------- auth actions ---------------- */
async function handleLogin(username, password) {
  state.authError = "";

  // Nhập dạng email -> coi là cố gắng đăng nhập admin qua Supabase Auth
  if (username.includes("@")) {
    const ok = await adminLogin(username, password);
    if (ok) {
      state.session = { username: "Admin", isAdmin: true };
      saveSession(state.session);
      render();
      return;
    }
    state.authError = "Sai email hoặc mật khẩu quản trị.";
    render();
    return;
  }

  const users = loadUsers();
  const found = users.find((u) => u.username === username && u.password === password);
  if (!found) { state.authError = "Sai tên đăng nhập hoặc mật khẩu."; render(); return; }
  state.session = { username: found.username, isAdmin: false };
  saveSession(state.session);
  render();
}

function handleRegister(username, password, confirm) {
  state.authError = "";
  if (!username.trim() || !password) { state.authError = "Vui lòng nhập đầy đủ thông tin."; render(); return; }
  if (password !== confirm) { state.authError = "Mật khẩu nhập lại không khớp."; render(); return; }
  if (username.trim().includes("@")) { state.authError = "Tên đăng nhập không được chứa @."; render(); return; }
  const users = loadUsers();
  if (users.find((u) => u.username === username.trim())) { state.authError = "Tài khoản đã tồn tại."; render(); return; }
  users.push({ username: username.trim(), password });
  saveUsers(users);
  state.session = { username: username.trim(), isAdmin: false };
  saveSession(state.session);
  render();
}

function handleLogout() {
  if (state.session && state.session.isAdmin) {
    adminLogout(); // đăng xuất khỏi Supabase, không cần đợi xong
  }
  state.session = null;
  saveSession(null);
  state.authView = "login";
  state.authError = "";
  render();
}

/* ---------------- content actions ---------------- */
function openAddEdit(type, index) {
  const existing = state.content[type][index];
  state.editItem = {
    type, index,
    data: existing ? { ...existing } : (type === "caption" ? { text: "" } : { title: "", url: "", content: "" }),
  };
  render();
}

async function saveEditFromForm(form) {
  const { type, index } = state.editItem;
  let data;
  if (type === "caption") {
    data = { text: form.text.value.trim() };
  } else {
    data = { title: form.title.value.trim(), url: form.url.value.trim(), content: form.content.value.trim() };
  }
  if (type === "caption" ? !data.text : !data.url) {
    state.editItem.data = data; // giữ lại những gì người dùng đã nhập, tránh mất dữ liệu khi render lại
    showToast(type === "caption" ? "Bạn chưa nhập nội dung caption." : "Bạn chưa dán link file.");
    return;
  }
  state.content[type][index] = data;
  state.editItem = null;
  state.syncing = true;
  render();

  const ok = await saveSiteData(state.content);
  state.syncing = false;
  showToast(ok ? "Đã lưu! Mọi người sẽ thấy ngay." : "Lưu lên hệ thống thất bại, hãy thử lại.");
}

async function deleteItem(type, index) {
  state.content[type][index] = null;
  state.openItem = null;
  state.syncing = true;
  render();

  const ok = await saveSiteData(state.content);
  state.syncing = false;
  showToast(ok ? "Đã xoá! Mọi người sẽ thấy ngay." : "Xoá thất bại, hãy thử lại.");
}

/* ---------------- share / save ---------------- */
function getLink(type, index) {
  return `${window.location.origin}${window.location.pathname}#${type}-${index}`;
}
function copyLink(type, index) {
  navigator.clipboard.writeText(getLink(type, index))
    .then(() => showToast("Đã copy link chia sẻ!"))
    .catch(() => showToast("Không copy được link."));
}
function shareFB(type, index) {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getLink(type, index))}`, "_blank");
}
function shareZalo(type, index) {
  window.open(`https://zalo.me/share?u=${encodeURIComponent(getLink(type, index))}`, "_blank");
}
function shareOther(type, index) {
  const link = getLink(type, index);
  if (navigator.share) navigator.share({ title: "Hộp Ký Ức", url: link }).catch(() => {});
  else copyLink(type, index);
}
async function saveMedia(url, filename) {
  try {
    const r = await fetch(url);
    const blob = await r.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
    showToast("Đang lưu file về máy...");
  } catch (e) {
    window.open(url, "_blank");
    showToast("Không tải trực tiếp được, đã mở tab mới để bạn lưu thủ công.");
  }
}
function copyCaption(text) {
  navigator.clipboard.writeText(text)
    .then(() => showToast("Đã copy caption!"))
    .catch(() => showToast("Không copy được."));
}

/* ============================================================
   RENDER
============================================================ */
function render() {
  const root = document.getElementById("app");
  root.innerHTML = state.session ? renderAppScreen() : renderAuthScreen();
}

function renderAuthScreen() {
  const isLogin = state.authView === "login";
  return `
  <div class="center-screen">
    <div class="auth-wrap">
      <div class="auth-title">
        <p class="ff-display">Hộp Ký Ức</p>
        <p>30 ô, mỗi ô một mảnh kỷ niệm.</p>
      </div>
      <div class="auth-card">
        <div class="pill-tabs">
          <button data-action="set-auth-view" data-view="login" class="${isLogin ? "active" : ""}">Đăng nhập</button>
          <button data-action="set-auth-view" data-view="register" class="${!isLogin ? "active" : ""}">Đăng ký</button>
        </div>
        <form id="${isLogin ? "login-form" : "register-form"}">
          <div class="field">${ICONS.user}<input name="username" placeholder="Tên đăng nhập" required /></div>
          <div class="field">${ICONS.lock}<input name="password" type="password" placeholder="Mật khẩu" required /></div>
          ${!isLogin ? `<div class="field">${ICONS.lock}<input name="confirm" type="password" placeholder="Nhập lại mật khẩu" required /></div>` : ""}
          ${state.authError ? `<p class="error-text">${escapeHtml(state.authError)}</p>` : ""}
          <button type="submit" class="btn btn-primary" style="margin-top:6px;">${isLogin ? "Vào trang" : "Tạo tài khoản"}</button>
        </form>
      </div>
      <p class="note-text">Quản trị viên đăng nhập bằng email + mật khẩu quản trị (tạo trong Supabase Auth).</p>
    </div>
  </div>`;
}

function renderAppScreen() {
  const tabContent = state.tab === "caption" ? renderCaptionGrid() : renderGrid30(state.tab);
  return `
  <div class="app-shell">
    ${renderHeader()}
    ${renderNav()}
    <main class="main-area">${tabContent}</main>
    ${state.openItem && state.content[state.openItem.type][state.openItem.index] ? renderDetailModal() : ""}
    ${state.editItem ? renderEditModal() : ""}
    ${state.toastMsg ? `<div class="toast">${escapeHtml(state.toastMsg)}</div>` : ""}
  </div>`;
}

function renderHeader() {
  const s = state.session;
  return `
  <header class="app-header">
    <p class="ff-display">Hộp Ký Ức</p>
    <div class="header-right">
      ${s.isAdmin ? `<button class="badge admin" data-action="refresh-cloud" style="cursor:pointer;" ${state.syncing ? "disabled" : ""}>${state.syncing ? "Đang lưu..." : "Tải lại dữ liệu"}</button>` : ""}
      <span class="badge ${s.isAdmin ? "admin" : ""}">${s.isAdmin ? "Quản trị" : escapeHtml(s.username)}</span>
      <button class="icon-btn" data-action="logout" aria-label="Đăng xuất">${ICONS.logout}</button>
    </div>
  </header>`;
}

function renderNav() {
  return `
  <nav class="app-nav">
    ${SECTIONS.map((s) => `
      <button data-action="set-tab" data-tab="${s.key}" class="${state.tab === s.key ? "active" : ""}">
        ${ICONS[s.key]} ${s.label}
      </button>`).join("")}
  </nav>`;
}

function renderGrid30(type) {
  const items = state.content[type];
  const isAdmin = state.session.isAdmin;
  return `<div class="grid30">${items.map((item, i) => renderCell(type, i, item, isAdmin)).join("")}</div>`;
}

function renderCell(type, index, item, isAdmin) {
  const filled = !!item;
  if (!filled) {
    const clickable = isAdmin;
    return `
    <button class="cell empty ${clickable ? "clickable" : ""}" ${clickable ? `data-action="open-add" data-type="${type}" data-index="${index}"` : "tabindex=\"-1\""}>
      <div class="cell-empty-inner">${isAdmin ? ICONS.plus : "trống"}</div>
    </button>`;
  }
  let thumb = null;
  if (type === "photo") thumb = item.url;
  else if (type === "video" && isYoutube(item.url)) thumb = ytThumb(item.url);

  const defaultTitle = type === "music" ? "Bản nhạc" : type === "video" ? "Video" : "Ảnh";
  return `
  <button class="cell filled ${thumb ? "has-thumb" : "no-thumb"}" style="${thumb ? `background-image:url('${thumb.replace(/'/g, "%27")}')` : ""}" data-action="open-item" data-type="${type}" data-index="${index}">
    <div class="cell-overlay ${thumb ? "has-thumb" : ""}">
      <span class="cell-num ${thumb ? "on-thumb" : "no-thumb"}">${pad2(index)}</span>
      <span class="cell-title-text" style="color:${thumb ? "#f1e9d8" : "var(--cream)"}">${escapeHtml(item.title || defaultTitle)}</span>
    </div>
    ${!thumb && (type === "music" || type === "video") ? `<div class="cell-type-icon">${ICONS[type]}</div>` : ""}
  </button>`;
}

function renderCaptionGrid() {
  const items = state.content.caption;
  const isAdmin = state.session.isAdmin;
  return `<div class="grid-caption">${items.map((item, i) => {
    const filled = !!item;
    if (!filled) {
      const clickable = isAdmin;
      return `
      <button class="cap-cell empty ${clickable ? "clickable" : ""}" ${clickable ? `data-action="open-add" data-type="caption" data-index="${i}"` : "tabindex=\"-1\""}>
        <span class="cell-num no-thumb">${pad2(i)}</span>
        <span class="cap-empty-label">${isAdmin ? "+ thêm" : "trống"}</span>
      </button>`;
    }
    return `
    <button class="cap-cell filled" data-action="open-item" data-type="caption" data-index="${i}">
      <span class="cell-num no-thumb">${pad2(i)}</span>
      <span class="cap-text">${escapeHtml(item.text)}</span>
    </button>`;
  }).join("")}</div>`;
}

function renderDetailModal() {
  const { type, index } = state.openItem;
  const data = state.content[type][index];
  const isAdmin = state.session.isAdmin;
  const filename = (data.url || "").split("/").pop().split("?")[0] || `tep-${index + 1}`;

  let media = "";
  if (type === "music") {
    media = `<p class="item-title">${escapeHtml(data.title || "Bản nhạc")}</p><div class="media-audio"><audio controls src="${escapeHtml(data.url)}"></audio></div>`;
  } else if (type === "video") {
    media = isYoutube(data.url)
      ? `<div class="media-video"><iframe src="${escapeHtml(ytEmbed(data.url))}" allowfullscreen></iframe></div>`
      : `<div class="media-video"><video controls src="${escapeHtml(data.url)}"></video></div>`;
  } else if (type === "photo") {
    media = `<div class="media-photo"><img src="${escapeHtml(data.url)}" alt="${escapeHtml(data.title || "ảnh")}" /></div>`;
  } else if (type === "caption") {
    media = `<p class="caption-quote">"${escapeHtml(data.text)}"</p>`;
  }

  const titleLine = (type !== "caption" && type !== "music" && data.title) ? `<p class="item-title" style="font-size:15px;margin-top:10px;">${escapeHtml(data.title)}</p>` : "";
  const contentLine = data.content ? `<p class="item-content">${escapeHtml(data.content)}</p>` : "";

  let footer = "";
  if (type === "caption") {
    footer = `<button class="btn btn-primary" data-action="copy-caption">${ICONS.copy} Copy caption</button>`;
  } else {
    footer = `
      <button class="btn btn-primary" data-action="save-media">${ICONS.download} Lưu về máy</button>
      <div class="btn-grid3">
        <button class="btn btn-ghost" data-action="copy-link">${ICONS.copy} Copy link</button>
        <button class="btn btn-ghost" data-action="share-fb">${ICONS.fb} Facebook</button>
        <button class="btn btn-ghost" data-action="share-zalo">${ICONS.share} Zalo/Mess</button>
      </div>
      <button class="btn btn-ghost" data-action="share-other">${ICONS.send} Chia sẻ qua ứng dụng khác</button>`;
  }
  if (isAdmin) {
    footer += `
      <div class="btn-row" style="margin-top:2px;">
        <button class="btn btn-ghost" data-action="edit-item">${ICONS.pencil} Sửa</button>
        <button class="btn btn-danger" data-action="delete-item">${ICONS.trash} Xoá</button>
      </div>`;
  }

  return `
  <div class="modal-overlay" data-action="close-modal">
    <div class="modal" onclick="event.stopPropagation()">
      <div class="modal-head">
        <span class="tag">${pad2(index)} · ${sectionInfo(type).sub}</span>
        <button class="icon-btn" data-action="close-modal" aria-label="Đóng">${ICONS.x}</button>
      </div>
      <div class="modal-body">${media}${titleLine}${contentLine}</div>
      <div class="modal-foot" data-filename="${escapeHtml(filename)}" data-url="${escapeHtml(data.url || "")}">${footer}</div>
    </div>
  </div>`;
}

function renderEditModal() {
  const { type, index, data } = state.editItem;
  const isNew = !state.content[type][index];
  let fields = "";
  if (type === "caption") {
    fields = `
      <div class="form-group">
        <label class="form-label">Nội dung caption</label>
        <textarea class="form-textarea" name="text" rows="4">${escapeHtml(data.text)}</textarea>
      </div>`;
  } else {
    const urlLabel = type === "music" ? "Link file nhạc (mp3...)" : type === "video" ? "Link video (mp4 hoặc YouTube)" : "Link ảnh";
    fields = `
      <div class="form-group">
        <label class="form-label">${urlLabel}</label>
        <input class="form-input" name="url" value="${escapeHtml(data.url)}" placeholder="https://..." />
      </div>
      <div class="form-group">
        <label class="form-label">Tiêu đề (tuỳ chọn)</label>
        <input class="form-input" name="title" value="${escapeHtml(data.title)}" />
      </div>
      <div class="form-group">
        <label class="form-label">Nội dung / ghi chú hiển thị dưới</label>
        <textarea class="form-textarea" name="content" rows="3">${escapeHtml(data.content)}</textarea>
      </div>`;
  }

  return `
  <div class="modal-overlay" data-action="close-edit">
    <div class="modal" onclick="event.stopPropagation()">
      <div class="modal-head">
        <span class="tag">${pad2(index)} · ${isNew ? "Thêm" : "Sửa"} ${sectionInfo(type).sub.toLowerCase()}</span>
        <button class="icon-btn" data-action="close-edit" aria-label="Đóng">${ICONS.x}</button>
      </div>
      <form id="edit-form" class="modal-body">
        ${fields}
        <p class="hint-text">Dán link tới file đã host sẵn (ví dụ trên GitHub Pages). Trang này không nhận upload file trực tiếp từ máy.</p>
        <button type="submit" class="btn btn-primary">Lưu</button>
      </form>
    </div>
  </div>`;
}

/* ============================================================
   EVENTS (event delegation)
============================================================ */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;

  switch (action) {
    case "set-auth-view":
      state.authView = btn.dataset.view; state.authError = ""; render(); break;
    case "logout":
      handleLogout(); break;
    case "set-tab":
      state.tab = btn.dataset.tab; state.openItem = null; render(); break;
    case "open-item":
      state.openItem = { type: btn.dataset.type, index: Number(btn.dataset.index) }; render(); break;
    case "open-add":
      openAddEdit(btn.dataset.type, Number(btn.dataset.index)); break;
    case "close-modal":
      state.openItem = null;
      history.replaceState(null, "", window.location.pathname);
      render(); break;
    case "close-edit":
      state.editItem = null; render(); break;
    case "edit-item": {
      const { type, index } = state.openItem;
      state.openItem = null;
      openAddEdit(type, index);
      break;
    }
    case "delete-item":
      deleteItem(state.openItem.type, state.openItem.index); break;
    case "copy-link":
      copyLink(state.openItem.type, state.openItem.index); break;
    case "share-fb":
      shareFB(state.openItem.type, state.openItem.index); break;
    case "share-zalo":
      shareZalo(state.openItem.type, state.openItem.index); break;
    case "share-other":
      shareOther(state.openItem.type, state.openItem.index); break;
    case "save-media": {
      const foot = btn.closest(".modal-foot");
      saveMedia(foot.dataset.url, foot.dataset.filename);
      break;
    }
    case "copy-caption":
      copyCaption(state.content.caption[state.openItem.index].text); break;
    case "refresh-cloud":
      refreshFromCloud(); break;
  }
});

document.addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.id === "login-form") {
    handleLogin(e.target.username.value.trim(), e.target.password.value);
  } else if (e.target.id === "register-form") {
    handleRegister(e.target.username.value, e.target.password.value, e.target.confirm.value);
  } else if (e.target.id === "edit-form") {
    saveEditFromForm(e.target);
  }
});

/* ============================================================
   INIT
============================================================ */
(function init() {
  const m = window.location.hash.replace("#", "").match(/^(music|video|photo|caption)-(\d+)$/);
  if (m) { state.tab = m[1]; state.openItem = { type: m[1], index: parseInt(m[2], 10) }; }
  render();
  // Vẽ tạm bằng dữ liệu mặc định trước, rồi tải bản mới nhất từ
  // Supabase để mọi người luôn thấy đúng nội dung hiện tại.
  refreshFromCloud();
})();
