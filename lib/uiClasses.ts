export function filterChipClass(active: boolean): string {
  return active ? "ui-filter-chip ui-filter-chip--active" : "ui-filter-chip";
}

export const ui = {
  panel: "ui-panel",
  panelHeader: "ui-panel-header",
  panelToolbar: "ui-panel-toolbar",
  countBadge: "ui-count-badge",
  tableCard: "ui-table-card",
  table: "ui-table",
  tableSimple: "ui-table ui-table--simple",
  tableScroll: "ui-table-scroll",
  tableMeta: "ui-table-meta",
  tableFooter: "ui-table-footer",
  filterBar: "ui-filter-bar",
  loadingBox: "ui-loading-box",
  spinner: "ui-spinner",
  searchInput: "ui-search-input",
  input: "ui-input",
  section: "ui-section",
  sectionHead: "ui-section-head",
  statCard: "ui-stat-card",
  statCardMuted: "ui-stat-card ui-stat-card--muted",
  clientCard: "ui-client-card",
  paginationBtn: "ui-pagination-btn",
  select: "ui-select",
  emptyState: "ui-empty-state",
  contentBlock: "ui-content-block",
  toggleGroup: "ui-toggle-group",
  toggleBtn: "ui-toggle-btn",
  toggleBtnActive: "ui-toggle-btn ui-toggle-btn--active",
  iconBtn: "ui-icon-btn",
  badge: "ui-badge",
} as const;

export function toggleBtnClass(active: boolean): string {
  return active ? ui.toggleBtnActive : ui.toggleBtn;
}
