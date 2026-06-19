let sb = null;
let currentUser = null;
let assets = [];
let files = [];
let lastFiltered = [];

const sampleAssets = [
  {
    entry_no: 1,
    tracker_date: today(),
    amf_number: "MT0626-001",
    vendor: "Mastec",
    contractor: "Mastec",
    site_id: "WA6745",
    asset_category: "ANT",
    asset_type: "Antenna",
    asset_description: "Decom antenna asset",
    quantity: 4,
    work_type: "Decom",
    pallet_id: "MP0626_001",
    pallet_status: "Staged",
    amf_file_name: "AMF_MP0626_001_ANT.xlsx",
    amf_date: today(),
    attachment_status: "Attached",
    banding_status: "Banded",
    return_status: "Returned",
    returned_date: today(),
    assigned_to: "Anoop",
    att_id: "ATT-63827",
    serial_number: "SN-NK-8842AX",
    manufacturer: "Nokia",
    condition: "Good",
    notes: "Sample row based on AMF asset tracking workflow"
  },
  {
    entry_no: 2,
    tracker_date: today(),
    amf_number: "MT0626-002",
    vendor: "Nokia",
    contractor: "Mastec",
    site_id: "WA3604",
    asset_category: "BBU",
    asset_type: "BBU",
    asset_description: "Nokia BBU decom asset",
    quantity: 2,
    work_type: "Decom",
    pallet_id: "MP0626_004",
    pallet_status: "Ready",
    amf_file_name: "AMF_MP0626_004_BBU.xlsx",
    amf_date: today(),
    attachment_status: "Attached",
    banding_status: "Banded",
    return_status: "Returned",
    returned_date: today(),
    assigned_to: "Anoop",
    att_id: "ATT-22781",
    serial_number: "SN-ER-66Q20",
    manufacturer: "Nokia",
    condition: "Good",
    notes: "Assisted with decom assets from site WA3604"
  },
  {
    entry_no: 3,
    tracker_date: today(),
    amf_number: "MT0626-003",
    vendor: "Ericsson",
    contractor: "Mastec",
    site_id: "WA5520",
    asset_category: "RAD",
    asset_type: "Radio",
    asset_description: "Radio fittings need removal",
    quantity: 1,
    work_type: "Return",
    pallet_id: "MP0626_005",
    pallet_status: "In Progress",
    amf_file_name: "AMF_MP0626_005_RADIO.xlsx",
    amf_date: today(),
    attachment_status: "Attached",
    banding_status: "Not Banded",
    return_status: "Pending",
    assigned_to: "Anoop",
    att_id: "ATT-44102",
    serial_number: "SN-SM-9182LA",
    manufacturer: "Ericsson",
    condition: "Needs Review",
    notes: "Extra fittings need to be removed before return"
  }
];

const els = {
  configWarning: document.getElementById("configWarning"),
  authPanel: document.getElementById("authPanel"),
  appContent: document.getElementById("appContent"),
  authForm: document.getElementById("authForm"),
  emailInput: document.getElementById("emailInput"),
  passwordInput: document.getElementById("passwordInput"),
  signUpBtn: document.getElementById("signUpBtn"),
  signOutBtn: document.getElementById("signOutBtn"),
  userInfo: document.getElementById("userInfo"),
  refreshBtn: document.getElementById("refreshBtn"),
  fileInput: document.getElementById("fileInput"),
  loadSampleBtn: document.getElementById("loadSampleBtn"),
  searchInput: document.getElementById("searchInput"),
  typeFilter: document.getElementById("typeFilter"),
  statusFilter: document.getElementById("statusFilter"),
  vendorFilter: document.getElementById("vendorFilter"),
  siteFilter: document.getElementById("siteFilter"),
  amfFilter: document.getElementById("amfFilter"),
  palletFilter: document.getElementById("palletFilter"),
  sortFilter: document.getElementById("sortFilter"),
  statTotal: document.getElementById("statTotal"),
  statFiles: document.getElementById("statFiles"),
  statReturned: document.getElementById("statReturned"),
  statMissing: document.getElementById("statMissing"),
  fileList: document.getElementById("fileList"),
  assetTable: document.getElementById("assetTable"),
  resultCount: document.getElementById("resultCount"),
  exportBtn: document.getElementById("exportBtn"),
  openAssetBtn: document.getElementById("openAssetBtn"),
  assetModal: document.getElementById("assetModal"),
  assetForm: document.getElementById("assetForm"),
  assetModalTitle: document.getElementById("assetModalTitle"),
  assetId: document.getElementById("assetId"),
  closeAssetBtn: document.getElementById("closeAssetBtn"),
  cancelAssetBtn: document.getElementById("cancelAssetBtn"),
  deleteAssetBtn: document.getElementById("deleteAssetBtn"),
  rawPreview: document.getElementById("rawPreview"),
  toast: document.getElementById("toast")
};

const aliases = {
  entry_no: ["entry no", "entry_no", "s.no", "s no", "serial", "no", "#"],
  tracker_date: ["date", "tracker date", "created date", "received date"],
  amf_number: ["amf no", "amf number", "amf#", "amf #", "mt number", "tracker id", "amf id"],
  vendor: ["vendor", "company", "supplier"],
  contractor: ["contractor", "vendor contractor", "mastec", "crew"],
  site_id: ["site id", "site", "site number", "site code", "siteid"],
  site_name: ["site name", "location name"],
  asset_category: ["asset category", "category", "cat", "asset cat"],
  asset_type: ["asset type", "type", "equipment type", "material", "item type"],
  asset_description: ["asset description", "description", "item description", "asset name", "equipment description"],
  quantity: ["qty", "quantity", "count", "total qty"],
  work_type: ["work type", "type of work", "source", "decom", "return type"],
  source_status: ["source status", "source_status", "source"],
  pallet_id: ["pallet", "pallet id", "pallet no", "pallet number", "return pallet"],
  pallet_status: ["pallet status", "pallet_status"],
  amf_file_name: ["amf file", "amf file name", "file name", "filename", "amf filename"],
  amf_date: ["amf date", "form date", "file date"],
  attachment_status: ["attached", "attachment status", "attachment", "attached status"],
  banding_status: ["banded", "banding status", "band status", "banding"],
  return_status: ["returned", "return status", "status", "returned status", "disposition"],
  returned_date: ["returned date", "return date", "date returned"],
  assigned_to: ["assigned to", "owner", "person", "handled by", "updated by"],
  att_id: ["att id", "attid", "at&t id", "asset tag", "asset tag id", "asset id", "tag id"],
  serial_number: ["serial number", "serial no", "serial", "sn", "s/n"],
  model_number: ["model number", "model no", "model"],
  part_number: ["part number", "part no", "part"],
  manufacturer: ["manufacturer", "oem", "make"],
  warehouse_location: ["warehouse location", "location", "rack", "pile"],
  condition: ["condition", "asset condition"],
  notes: ["notes", "remarks", "comments", "comment"]
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function isConfigured() {
  return window.ASSETFLOW_SUPABASE_URL &&
    window.ASSETFLOW_SUPABASE_ANON_KEY &&
    !window.ASSETFLOW_SUPABASE_URL.includes("PASTE_YOUR") &&
    !window.ASSETFLOW_SUPABASE_ANON_KEY.includes("PASTE_YOUR");
}

function initSupabase() {
  if (!isConfigured() || !window.supabase) {
    els.configWarning.hidden = false;
    els.authPanel.hidden = true;
    return false;
  }

  sb = window.supabase.createClient(
    window.ASSETFLOW_SUPABASE_URL,
    window.ASSETFLOW_SUPABASE_ANON_KEY
  );

  return true;
}

async function initAuth() {
  const { data } = await sb.auth.getSession();
  currentUser = data.session?.user || null;
  updateAuthView();

  sb.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user || null;
    updateAuthView();
  });
}

async function updateAuthView() {
  if (!currentUser) {
    els.authPanel.hidden = false;
    els.appContent.hidden = true;
    return;
  }

  els.authPanel.hidden = true;
  els.appContent.hidden = false;
  els.userInfo.textContent = `Signed in as ${currentUser.email}. Data is stored in shared Supabase tables.`;
  await loadData();
}

async function signIn(event) {
  event.preventDefault();
  const email = els.emailInput.value.trim();
  const password = els.passwordInput.value;

  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    showToast(error.message);
    return;
  }

  els.authForm.reset();
  showToast("Signed in");
}

async function signUp() {
  const email = els.emailInput.value.trim();
  const password = els.passwordInput.value;

  if (!email || !password) {
    showToast("Enter email and password first");
    return;
  }

  const { error } = await sb.auth.signUp({ email, password });
  if (error) {
    showToast(error.message);
    return;
  }

  showToast("Account created. Check email if confirmation is enabled.");
}

async function signOut() {
  await sb.auth.signOut();
  showToast("Signed out");
}

async function loadData() {
  const { data: assetRows, error: assetError } = await sb
    .from("assets")
    .select("*")
    .order("updated_at", { ascending: false });

  if (assetError) {
    showToast(assetError.message);
    return;
  }

  const { data: fileRows, error: fileError } = await sb
    .from("amf_files")
    .select("*")
    .order("uploaded_at", { ascending: false });

  if (fileError) {
    showToast(fileError.message);
    return;
  }

  assets = assetRows || [];
  files = fileRows || [];
  render();
}

function normalizeKey(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ").replace(/[_.-]+/g, " ");
}

function findValue(row, key) {
  const normalizedMap = {};
  Object.keys(row).forEach((originalKey) => {
    normalizedMap[normalizeKey(originalKey)] = row[originalKey];
  });

  for (const alias of aliases[key] || []) {
    const value = normalizedMap[normalizeKey(alias)];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }

  return "";
}

function normalizeRow(row, fileName, index) {
  const record = {};
  Object.keys(aliases).forEach((key) => {
    record[key] = findValue(row, key);
  });

  record.entry_no = parseInt(record.entry_no || index + 1, 10) || null;
  record.quantity = parseInt(record.quantity || "1", 10) || 1;
  record.tracker_date = parseDate(record.tracker_date);
  record.amf_date = parseDate(record.amf_date);
  record.returned_date = parseDate(record.returned_date);
  record.amf_file_name = record.amf_file_name || fileName;
  record.return_status = normalizeStatus(record.return_status);
  record.raw_data = row;
  record.created_by = currentUser.id;
  record.updated_by = currentUser.id;
  record.search_text = buildSearchText(record);

  return record;
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
  return null;
}

function normalizeStatus(value) {
  const status = String(value || "").trim();
  const lower = status.toLowerCase();
  if (!status) return "Imported";
  if (lower.includes("return")) return "Returned";
  if (lower.includes("miss")) return "Missing";
  if (lower.includes("stage")) return "Staged";
  if (lower.includes("review")) return "Needs Review";
  if (lower.includes("pend")) return "Pending";
  return status;
}

function buildSearchText(record) {
  return Object.values(record).concat(Object.values(record.raw_data || {})).join(" ").toLowerCase();
}

function isUseful(record) {
  return Boolean(
    record.att_id ||
    record.serial_number ||
    record.asset_type ||
    record.asset_category ||
    record.site_id ||
    record.amf_number ||
    record.amf_file_name ||
    record.pallet_id ||
    record.vendor ||
    record.notes ||
    Object.values(record.raw_data || {}).some((v) => String(v || "").trim())
  );
}

async function parseFile(file) {
  const extension = file.name.split(".").pop().toLowerCase();

  if ((extension === "xlsx" || extension === "xls") && !window.XLSX) {
    throw new Error("Excel parser did not load.");
  }

  if (extension === "csv" && !window.XLSX) {
    const text = await file.text();
    return parseCSV(text);
  }

  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
}

function parseCSV(text) {
  const rows = [];
  const lines = text.replace(/\r/g, "").split("\n").filter((line) => line.trim() !== "");
  if (!lines.length) return rows;

  const headers = splitCSVLine(lines[0]);
  for (let i = 1; i < lines.length; i++) {
    const values = splitCSVLine(lines[i]);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });
    rows.push(row);
  }
  return rows;
}

function splitCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

async function handleFileUpload(event) {
  const selectedFiles = Array.from(event.target.files || []);
  if (!selectedFiles.length) return;

  for (const file of selectedFiles) {
    try {
      const rows = await parseFile(file);
      const records = rows.map((row, index) => normalizeRow(row, file.name, index)).filter(isUseful);

      if (records.length) {
        const { error } = await sb.from("assets").insert(records);
        if (error) throw error;
      }

      await sb.from("amf_files").insert({
        file_name: file.name,
        file_type: file.name.split(".").pop().toLowerCase(),
        imported_rows: records.length,
        file_size: file.size,
        source: "AMF Upload",
        created_by: currentUser.id
      });

      showToast(`Imported ${records.length} rows from ${file.name}`);
    } catch (error) {
      showToast(`Could not import ${file.name}: ${error.message}`);
    }
  }

  event.target.value = "";
  await loadData();
}

async function loadSampleData() {
  const records = sampleAssets.map((asset) => ({
    ...asset,
    created_by: currentUser.id,
    updated_by: currentUser.id,
    raw_data: asset,
    search_text: buildSearchText(asset)
  }));

  const { error } = await sb.from("assets").insert(records);
  if (error) {
    showToast(error.message);
    return;
  }

  await sb.from("amf_files").insert({
    file_name: "sample-amf-data.csv",
    file_type: "csv",
    imported_rows: records.length,
    file_size: 714,
    source: "Sample Data",
    created_by: currentUser.id
  });

  showToast("Sample data loaded");
  await loadData();
}

function populateSelect(select, values, label) {
  const current = select.value;
  const unique = [...new Set(values.filter(Boolean).map((v) => String(v).trim()))].sort((a, b) => a.localeCompare(b));
  select.innerHTML = `<option value="">${label}</option>` + unique.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");
  if (unique.includes(current)) select.value = current;
}

function renderFilters() {
  populateSelect(els.typeFilter, assets.map((a) => a.asset_type), "All asset types");
  populateSelect(els.statusFilter, assets.map((a) => a.return_status), "All statuses");
  populateSelect(els.vendorFilter, assets.map((a) => a.vendor), "All vendors");
}

function assetMatches(asset) {
  const query = els.searchInput.value.trim().toLowerCase();
  const type = els.typeFilter.value;
  const status = els.statusFilter.value;
  const vendor = els.vendorFilter.value;
  const site = els.siteFilter.value.trim().toLowerCase();
  const amf = els.amfFilter.value.trim().toLowerCase();
  const pallet = els.palletFilter.value.trim().toLowerCase();
  const searchable = `${asset.search_text || ""} ${JSON.stringify(asset.raw_data || {})}`.toLowerCase();

  return (
    (!query || searchable.includes(query)) &&
    (!type || asset.asset_type === type) &&
    (!status || asset.return_status === status) &&
    (!vendor || asset.vendor === vendor) &&
    (!site || String(asset.site_id || "").toLowerCase().includes(site)) &&
    (!amf || `${asset.amf_file_name || ""} ${asset.amf_number || ""}`.toLowerCase().includes(amf)) &&
    (!pallet || String(asset.pallet_id || "").toLowerCase().includes(pallet))
  );
}

function sortedAssets(list) {
  const sortBy = els.sortFilter.value;
  const sorted = [...list];
  sorted.sort((a, b) => {
    if (sortBy === "newest") return String(b.updated_at || "").localeCompare(String(a.updated_at || ""));
    return String(a[sortBy] || "").localeCompare(String(b[sortBy] || ""));
  });
  return sorted;
}

function renderStats() {
  const returned = assets.filter((a) => String(a.return_status || "").toLowerCase().includes("return")).length;
  const missing = assets.filter((a) => {
    const s = String(a.return_status || "").toLowerCase();
    return s.includes("miss") || s.includes("review");
  }).length;

  els.statTotal.textContent = assets.length;
  els.statFiles.textContent = files.length;
  els.statReturned.textContent = returned;
  els.statMissing.textContent = missing;
}

function renderFiles() {
  if (!files.length) {
    els.fileList.innerHTML = `<p class="empty">No files uploaded yet.</p>`;
    return;
  }

  els.fileList.innerHTML = files.map((file) => `
    <div class="file-item">
      <div>
        <strong>${escapeHtml(file.file_name)}</strong>
        <span>${file.imported_rows || 0} rows · ${escapeHtml(file.file_type || "")} · ${escapeHtml(file.source || "Upload")} · ${formatDateTime(file.uploaded_at)}</span>
      </div>
      <span class="status imported">Saved</span>
    </div>
  `).join("");
}

function renderTable() {
  const filtered = sortedAssets(assets.filter(assetMatches));
  lastFiltered = filtered;

  if (!filtered.length) {
    els.assetTable.innerHTML = `<tr><td colspan="21" class="muted-cell">No matching assets found.</td></tr>`;
    els.resultCount.textContent = `Showing 0 of ${assets.length} assets`;
    return;
  }

  els.assetTable.innerHTML = filtered.map((a) => `
    <tr>
      <td>${empty(a.entry_no)}</td>
      <td>${empty(a.tracker_date)}</td>
      <td>${empty(a.amf_number)}</td>
      <td>${empty(a.vendor)}</td>
      <td>${empty(a.site_id)}</td>
      <td>${empty(a.asset_category)}</td>
      <td>${empty(a.asset_type)}</td>
      <td>${empty(a.asset_description)}</td>
      <td>${empty(a.quantity)}</td>
      <td>${empty(a.work_type)}</td>
      <td>${empty(a.pallet_id)}</td>
      <td>${empty(a.amf_file_name)}</td>
      <td>${empty(a.amf_date)}</td>
      <td>${empty(a.attachment_status)}</td>
      <td>${empty(a.banding_status)}</td>
      <td><span class="status ${statusClass(a.return_status)}">${escapeHtml(a.return_status || "Imported")}</span></td>
      <td>${empty(a.returned_date)}</td>
      <td>${empty(a.att_id)}</td>
      <td>${empty(a.serial_number)}</td>
      <td>${empty(a.assigned_to)}</td>
      <td class="action-cell"><button class="row-btn" type="button" onclick="openAssetEditor('${a.id}')">Edit</button></td>
    </tr>
  `).join("");

  els.resultCount.textContent = `Showing ${filtered.length} of ${assets.length} assets`;
}

function render() {
  renderFilters();
  renderStats();
  renderFiles();
  renderTable();
}

function statusClass(status) {
  const value = String(status || "").toLowerCase();
  if (value.includes("return")) return "returned";
  if (value.includes("missing")) return "missing";
  if (value.includes("review")) return "needs-review";
  if (value.includes("stage")) return "staged";
  return "pending";
}

function empty(value) {
  const string = String(value ?? "").trim();
  return string ? escapeHtml(string) : `<span class="muted-cell">-</span>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${sizes[i]}`;
}

function openAddAsset() {
  els.assetModalTitle.textContent = "Add Asset";
  els.assetForm.reset();
  els.assetId.value = "";
  els.deleteAssetBtn.style.display = "none";
  els.rawPreview.textContent = "Manual asset. No raw imported row yet.";
  els.assetModal.showModal();
}

function openAssetEditor(id) {
  const asset = assets.find((item) => item.id === id);
  if (!asset) return;

  els.assetModalTitle.textContent = "Edit Asset";
  els.assetForm.reset();
  els.assetId.value = asset.id;

  Object.keys(aliases).forEach((key) => {
    if (els.assetForm.elements[key]) {
      els.assetForm.elements[key].value = asset[key] || "";
    }
  });

  els.deleteAssetBtn.style.display = "inline-flex";
  els.rawPreview.textContent = JSON.stringify(asset.raw_data || {}, null, 2);
  els.assetModal.showModal();
}

async function saveAsset(event) {
  event.preventDefault();

  const formData = new FormData(els.assetForm);
  const id = formData.get("id");
  const record = {};

  Object.keys(aliases).forEach((key) => {
    record[key] = formData.get(key) || null;
  });

  record.entry_no = record.entry_no ? parseInt(record.entry_no, 10) : null;
  record.quantity = record.quantity ? parseInt(record.quantity, 10) : 1;
  record.tracker_date = record.tracker_date || null;
  record.amf_date = record.amf_date || null;
  record.returned_date = record.returned_date || null;
  record.updated_by = currentUser.id;
  record.search_text = buildSearchText(record);

  let result;
  if (id) {
    result = await sb.from("assets").update(record).eq("id", id);
  } else {
    record.created_by = currentUser.id;
    record.raw_data = record;
    result = await sb.from("assets").insert(record);
  }

  if (result.error) {
    showToast(result.error.message);
    return;
  }

  els.assetModal.close();
  showToast(id ? "Asset updated" : "Asset added");
  await loadData();
}

async function deleteAsset() {
  const id = els.assetId.value;
  if (!id) return;
  if (!confirm("Delete this asset from Supabase?")) return;

  const { error } = await sb.from("assets").delete().eq("id", id);
  if (error) {
    showToast(error.message);
    return;
  }

  els.assetModal.close();
  showToast("Asset deleted");
  await loadData();
}

function exportCSV() {
  if (!lastFiltered.length) {
    showToast("No rows to export");
    return;
  }

  const headers = [
    "entry_no", "tracker_date", "amf_number", "vendor", "contractor", "site_id", "site_name",
    "asset_category", "asset_type", "asset_description", "quantity", "work_type", "pallet_id",
    "pallet_status", "amf_file_name", "amf_date", "attachment_status", "banding_status",
    "return_status", "returned_date", "assigned_to", "att_id", "serial_number", "model_number",
    "part_number", "manufacturer", "warehouse_location", "condition", "source_status", "notes"
  ];

  const csv = [headers, ...lastFiltered.map((row) => headers.map((h) => row[h] || ""))]
    .map((row) => row.map(csvCell).join(","))
    .join("\n");

  downloadText(`assetflow-report-${today()}.csv`, csv, "text/csv");
  showToast("Filtered CSV exported");
}

function csvCell(value) {
  const string = String(value ?? "");
  if (/[",\n]/.test(string)) return `"${string.replaceAll('"', '""')}"`;
  return string;
}

function downloadText(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  setTimeout(() => els.toast.classList.remove("show"), 2800);
}

function bindEvents() {
  els.authForm.addEventListener("submit", signIn);
  els.signUpBtn.addEventListener("click", signUp);
  els.signOutBtn.addEventListener("click", signOut);
  els.refreshBtn.addEventListener("click", loadData);
  els.fileInput.addEventListener("change", handleFileUpload);
  els.loadSampleBtn.addEventListener("click", loadSampleData);
  els.exportBtn.addEventListener("click", exportCSV);
  els.openAssetBtn.addEventListener("click", openAddAsset);
  els.closeAssetBtn.addEventListener("click", () => els.assetModal.close());
  els.cancelAssetBtn.addEventListener("click", () => els.assetModal.close());
  els.deleteAssetBtn.addEventListener("click", deleteAsset);
  els.assetForm.addEventListener("submit", saveAsset);

  [
    els.searchInput,
    els.typeFilter,
    els.statusFilter,
    els.vendorFilter,
    els.siteFilter,
    els.amfFilter,
    els.palletFilter,
    els.sortFilter
  ].forEach((input) => {
    input.addEventListener("input", renderTable);
    input.addEventListener("change", renderTable);
  });
}

bindEvents();

if (initSupabase()) {
  initAuth();
}
