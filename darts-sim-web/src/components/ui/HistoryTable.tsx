import React from "react";
import type { SimulationRecord, GameRule } from "../../types/simulation";
import type { ThemeColors } from "../../hooks/useTheme";
import type { TFunc, Translation } from "../../i18n/translations";
import { COLORS, BOARD_X_MAP } from "../../constants";

interface HistoryTableProps {
  history: SimulationRecord[];
  gameRule: GameRule;
  deselectedIds: Set<number>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  onToggleSelect: (id: number) => void;
  onDeleteRecord: (id: number) => void;
  onDeleteAll: () => void;
  onShowAll: () => void;
  onHideAll: () => void;
  onShowHistoryInfo: (pos: { top: number; left: number }) => void;
  C: ThemeColors;
  t: TFunc;
}

const PAGE_SIZE = 5;

export default function HistoryTable({
  history, gameRule,
  deselectedIds,
  page, setPage,
  onToggleSelect, onDeleteRecord, onDeleteAll,
  onShowAll, onHideAll,
  onShowHistoryInfo,
  C, t,
}: HistoryTableProps) {
  const [hoveredRowId, setHoveredRowId] = React.useState<number | null>(null);

  const filteredHistory = history.filter(r => r.gameRule === gameRule);
  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedHistory = filteredHistory.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const isSelected = (id: number) => !deselectedIds.has(id);
  const allVisible = filteredHistory.length > 0 && filteredHistory.every(r => !deselectedIds.has(r.id));
  const allHidden  = filteredHistory.length === 0 || filteredHistory.every(r => deselectedIds.has(r.id));

  const tdBase: React.CSSProperties = { padding: "8px", borderBottom: `1px solid ${C.tableRowBorder}`, fontSize: "13px" };

  const flightName = (shape: string | undefined) => {
    if (!shape) return "-";
    const key = `flightName${shape}` as keyof Translation;
    return t(key) ?? shape;
  };

  const cols = [
    t('colColor'), t('colVisible'), t('colFlight'), t('colShaft'), t('colBarrel'),
    t('colWeight'), t('colCg'), t('colSpeed'), t('colAngle'), t('colHeight'),
    t('colDistance'), t('colGrip'), t('colPitch'), t('colDatetime'), t('colOperation'),
  ];

  return (
    <div style={{ fontSize: "14px", padding: "12px 20px", background: C.panelBg, borderRadius: "8px", border: `1px solid ${C.panelBorder}`, marginTop: "20px" }}>
      <div className="history-header">
        <div className="history-header-title">
          <h3 style={{ margin: 0, fontSize: "16px", color: C.textAccent, fontWeight: "bold" }}>{t('historyTitle')}</h3>
          <button onClick={e => { const rect = (e.target as HTMLElement).getBoundingClientRect(); onShowHistoryInfo({ top: rect.bottom + 6, left: rect.left }); }} style={{ width: "18px", height: "18px", borderRadius: "50%", border: `1px solid ${C.infoBtnBorder}`, background: C.infoBtn, color: C.textAccent, fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>?</button>
        </div>
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} style={{ padding: "3px 10px", fontSize: "13px", borderRadius: "4px", cursor: currentPage <= 1 ? "default" : "pointer", background: currentPage <= 1 ? C.paginBg : C.btnBg, color: currentPage <= 1 ? C.btnDisText : C.paginText, border: `1px solid ${currentPage <= 1 ? C.btnDisBorder : C.btnBorder}` }}>{t('prev')}</button>
            <span style={{ color: C.textAccent, fontSize: "13px" }}>{currentPage} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} style={{ padding: "3px 10px", fontSize: "13px", borderRadius: "4px", cursor: currentPage >= totalPages ? "default" : "pointer", background: currentPage >= totalPages ? C.paginBg : C.btnBg, color: currentPage >= totalPages ? C.btnDisText : C.paginText, border: `1px solid ${currentPage >= totalPages ? C.btnDisBorder : C.btnBorder}` }}>{t('next')}</button>
          </div>
        )}
        <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
          <button onClick={onShowAll} disabled={filteredHistory.length === 0 || allVisible} style={{ padding: "3px 10px", fontSize: "13px", borderRadius: "6px", cursor: (filteredHistory.length === 0 || allVisible) ? "default" : "pointer", background: (filteredHistory.length === 0 || allVisible) ? C.btnDisBg : C.btnBg, color: (filteredHistory.length === 0 || allVisible) ? C.btnDisText : C.btnText, border: `1px solid ${(filteredHistory.length === 0 || allVisible) ? C.btnDisBorder : C.btnBorder}` }}>{t('showAll')}</button>
          <button onClick={onHideAll} disabled={allHidden} style={{ padding: "3px 10px", fontSize: "13px", borderRadius: "6px", cursor: allHidden ? "default" : "pointer", background: allHidden ? C.btnDisBg : C.btnBg, color: allHidden ? C.btnDisText : C.btnText, border: `1px solid ${allHidden ? C.btnDisBorder : C.btnBorder}` }}>{t('hideAll')}</button>
          <button onClick={onDeleteAll} disabled={history.length === 0} style={{ padding: "3px 10px", fontSize: "13px", borderRadius: "6px", cursor: history.length === 0 ? "default" : "pointer", background: history.length === 0 ? C.btnDisBg : C.deleteBg, color: history.length === 0 ? C.btnDisText : C.deleteText, border: `1px solid ${history.length === 0 ? C.btnDisBorder : C.deleteBorder}` }}>{t('deleteAll')}</button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", textAlign: "center", borderCollapse: "collapse", backgroundColor: "transparent", color: C.tableText }}>
          <thead>
            <tr>
              {cols.map(h => (
                <th key={h} style={{ padding: "8px 8px 10px", backgroundColor: C.tableHeaderBg, color: C.tableHeaderText, fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", borderBottom: `1px solid ${C.tableRowBorder}`, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedHistory.map((record) => {
              const rowColor = COLORS[record.id % COLORS.length];
              const selected = isSelected(record.id);
              const hovered  = hoveredRowId === record.id;
              return (
                <tr key={record.id} onMouseEnter={() => setHoveredRowId(record.id)} onMouseLeave={() => setHoveredRowId(null)} onClick={() => onToggleSelect(record.id)} style={{ backgroundColor: hovered ? C.tableRowHov : selected ? C.tableRowSel : C.tableRowBg, transition: "background-color 0.1s ease", cursor: "pointer" }}>
                  <td style={{ ...tdBase, textAlign: "center", borderLeft: selected ? `3px solid ${rowColor}` : "3px solid transparent" }}>
                    <span style={{ display: "inline-block", width: "14px", height: "14px", borderRadius: "50%", background: rowColor, boxShadow: `0 0 6px ${rowColor}90` }} />
                  </td>
                  <td style={{ ...tdBase, padding: "6px 8px" }}>
                    <button onClick={(e) => { e.stopPropagation(); onToggleSelect(record.id); }} style={{ width: "32px", height: "26px", borderRadius: "5px", cursor: "pointer", fontSize: "13px", border: selected ? `1px solid ${rowColor}60` : `1px solid ${C.rowToggleBorder}`, background: selected ? `${rowColor}20` : C.rowToggleBg, color: selected ? rowColor : C.rowToggleOff, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>{selected ? "✔" : "✖"}</button>
                  </td>
                  <td style={tdBase}>{flightName(record.flightShape)}</td>
                  <td style={tdBase}>{record.shaftLength ?? "-"}</td>
                  <td style={tdBase}>{record.barrelLength ?? "-"}</td>
                  <td style={tdBase}>{record.weight ?? "-"}</td>
                  <td style={tdBase}>{record.cgRatio != null ? Math.round(record.cgRatio / 100 * (record.barrelLength ?? 45) * 10) / 10 : "-"}</td>
                  <td style={tdBase}>{Math.round(record.initialVelocity * 3.6 * 10) / 10}</td>
                  <td style={tdBase}>{Math.round(record.angle * (180 / Math.PI) * 10) / 10}</td>
                  <td style={tdBase}>{record.releaseHeight != null ? Math.round(record.releaseHeight * 100) : "-"}</td>
                  <td style={tdBase}>{record.releaseDistance != null ? Math.round((BOARD_X_MAP[record.gameRule] - record.releaseDistance) * 100) : "-"}</td>
                  <td style={tdBase}>{record.gripRatio != null ? Math.round(record.gripRatio / 100 * (record.barrelLength ?? 45)) : "-"}</td>
                  <td style={tdBase}>{record.initialPitch != null ? Math.round(record.initialPitch * 10) / 10 : "-"}</td>
                  <td style={{ ...tdBase, whiteSpace: "nowrap" }}>{new Date(record.createdAt).toLocaleString()}</td>
                  <td style={{ ...tdBase, padding: "6px 8px" }}>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteRecord(record.id); }} style={{ padding: "3px 10px", fontSize: "12px", background: C.deleteBg, color: C.deleteText, border: `1px solid ${C.deleteBorder}`, borderRadius: "6px", cursor: "pointer" }}>{t('deleteBtn')}</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
