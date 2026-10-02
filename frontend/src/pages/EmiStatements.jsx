import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "../api/axios";
import { useReactToPrint } from "react-to-print";
import { Printer, X, Eye, FileText, Search, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const fmt = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const inr = (val) =>
  "₹" + parseFloat(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

// ─── Printable Statement ───────────────────────────────────────────────────────
const PrintStatement = React.forwardRef(({ plan }, ref) => {
  const installments = plan.installments || [];
  const paidAmt = installments.filter(i => i.status === "paid").reduce((s, i) => s + parseFloat(i.amount), 0);
  const pendingAmt = installments.filter(i => i.status !== "paid").reduce((s, i) => s + parseFloat(i.amount), 0);
  const associate = plan.transaction?.sellerAssociate || {};
  const buyer = plan.transaction?.buyer || {};
  const plot = plan.transaction?.plot || {};

  return (
    <div ref={ref} style={{ fontFamily: "'Segoe UI', sans-serif", padding: "40px", maxWidth: "900px", margin: "0 auto", color: "#1a1a2e" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "4px solid #D4AF37", paddingBottom: "24px", marginBottom: "30px" }}>
        <div>
          <img src="/logo.png" alt="Devojas Realtors" style={{ height: "64px", objectFit: "contain" }}
            onError={e => { e.target.style.display = "none"; }} />
          <h2 style={{ margin: "10px 0 2px", fontSize: "22px", fontWeight: 700, color: "#0b1437" }}>Devojas Realtors Pvt. Ltd.</h2>
          <p style={{ margin: 0, color: "#666", fontSize: "12px" }}>Real Estate Management | India</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ background: "#0b1437", color: "#D4AF37", padding: "8px 18px", borderRadius: "8px", fontWeight: 800, fontSize: "22px", letterSpacing: "2px", marginBottom: "10px" }}>
            EMI STATEMENT
          </div>
          <p style={{ margin: "4px 0", fontSize: "13px", fontWeight: 600 }}>Statement ID: <span style={{ color: "#D4AF37" }}>#EMI-{plan.id}</span></p>
          <p style={{ margin: "4px 0", fontSize: "13px" }}>Date: {fmt(new Date().toISOString())}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
        {/* Associate Details */}
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px" }}>
          <div style={{ background: "#0b1437", color: "#D4AF37", padding: "6px 12px", borderRadius: "6px", fontWeight: 700, fontSize: "13px", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Associate Details
          </div>
          <Row label="Name" value={associate.name || "N/A"} />
          <Row label="Associate ID" value={associate.login_id || "N/A"} />
          <Row label="Address" value={associate.address || "N/A"} />
          <Row label="Phone" value={associate.phone || "N/A"} />
          <Row label="Referred By (ID)" value={associate.referred_by || "None"} />
        </div>

        {/* Client & Plot Details */}
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px" }}>
          <div style={{ background: "#0b1437", color: "#D4AF37", padding: "6px 12px", borderRadius: "6px", fontWeight: 700, fontSize: "13px", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Client & Plot Details
          </div>
          <Row label="Client Name" value={buyer.name || "N/A"} />
          <Row label="Client ID" value={buyer.login_id || "N/A"} />
          <Row label="Plot No." value={plot.plot_number || "N/A"} />
          <Row label="Total Price" value={inr(plan.total_amount)} />
          <Row label="Down Payment" value={inr(plan.down_payment)} />
          <Row label="Monthly EMI" value={inr(plan.monthly_amount)} />
        </div>
      </div>

      {/* Summary Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "28px" }}>
        <SummaryCard label="Total EMI Amount" value={inr(parseFloat(plan.total_amount) - parseFloat(plan.down_payment || 0))} color="#0b1437" />
        <SummaryCard label="Amount Paid" value={inr(paidAmt)} color="#166534" />
        <SummaryCard label="Balance Remaining" value={inr(pendingAmt)} color="#991b1b" />
      </div>

      {/* Installment Table */}
      <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 700, color: "#0b1437", borderBottom: "2px solid #D4AF37", paddingBottom: "6px" }}>
        EMI Schedule — Month-wise Breakup
      </h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "30px" }}>
        <thead>
          <tr style={{ background: "#0b1437", color: "#D4AF37" }}>
            {["Month #", "Due Date", "EMI Amount", "Amount Paid", "Balance", "Status", "Paid On"].map(h => (
              <th key={h} style={{ padding: "10px 12px", textAlign: h === "Month #" ? "center" : "left", border: "1px solid #1e3a8a" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {installments.map((inst, idx) => {
            const isPaid = inst.status === "paid";
            const isOverdue = inst.status === "overdue";
            const rowBg = idx % 2 === 0 ? "#fff" : "#f8fafc";
            return (
              <tr key={inst.id} style={{ background: rowBg }}>
                <td style={{ padding: "9px 12px", textAlign: "center", border: "1px solid #e2e8f0", fontWeight: 700 }}>{inst.month_number}</td>
                <td style={{ padding: "9px 12px", border: "1px solid #e2e8f0" }}>{fmt(inst.due_date)}</td>
                <td style={{ padding: "9px 12px", border: "1px solid #e2e8f0", fontWeight: 600 }}>{inr(inst.amount)}</td>
                <td style={{ padding: "9px 12px", border: "1px solid #e2e8f0", color: isPaid ? "#166534" : "#64748b" }}>{isPaid ? inr(inst.amount) : "—"}</td>
                <td style={{ padding: "9px 12px", border: "1px solid #e2e8f0", color: isPaid ? "#64748b" : "#991b1b" }}>{isPaid ? "—" : inr(inst.amount)}</td>
                <td style={{ padding: "9px 12px", border: "1px solid #e2e8f0" }}>
                  <span style={{
                    background: isPaid ? "#dcfce7" : isOverdue ? "#fee2e2" : "#fef9c3",
                    color: isPaid ? "#166534" : isOverdue ? "#991b1b" : "#854d0e",
                    padding: "3px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase"
                  }}>{inst.status}</span>
                </td>
                <td style={{ padding: "9px 12px", border: "1px solid #e2e8f0", color: "#64748b" }}>{inst.paid_on ? fmt(inst.paid_on) : "—"}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr style={{ background: "#f1f5f9", fontWeight: 700 }}>
            <td colSpan="2" style={{ padding: "10px 12px", border: "1px solid #e2e8f0", textAlign: "right" }}>TOTAL</td>
            <td style={{ padding: "10px 12px", border: "1px solid #e2e8f0" }}>{inr(installments.reduce((s, i) => s + parseFloat(i.amount), 0))}</td>
            <td style={{ padding: "10px 12px", border: "1px solid #e2e8f0", color: "#166534" }}>{inr(paidAmt)}</td>
            <td style={{ padding: "10px 12px", border: "1px solid #e2e8f0", color: "#991b1b" }}>{inr(pendingAmt)}</td>
            <td colSpan="2" style={{ border: "1px solid #e2e8f0" }}></td>
          </tr>
        </tfoot>
      </table>

      {/* Footer */}
      <div style={{ borderTop: "2px solid #D4AF37", paddingTop: "16px", textAlign: "center", fontSize: "11px", color: "#94a3b8", marginTop: "20px" }}>
        <p style={{ margin: "0 0 4px" }}>This is a computer-generated statement and does not require a physical signature.</p>
        <p style={{ margin: 0 }}>For discrepancies, contact accounts@devojas.com | Devojas Realtors Pvt. Ltd.</p>
      </div>
    </div>
  );
});

const Row = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #f1f5f9", fontSize: "13px" }}>
    <span style={{ color: "#64748b" }}>{label}</span>
    <span style={{ fontWeight: 600, color: "#1a1a2e" }}>{value}</span>
  </div>
);

const SummaryCard = ({ label, value, color }) => (
  <div style={{ border: `2px solid ${color}`, borderRadius: "10px", padding: "14px", textAlign: "center" }}>
    <p style={{ margin: "0 0 6px", fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
    <p style={{ margin: 0, fontSize: "20px", fontWeight: 800, color }}>{value}</p>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const EmiStatements = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [search, setSearch] = useState("");
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({ contentRef: printRef, documentTitle: selectedPlan ? `EMI_Statement_${selectedPlan.id}` : "EMI_Statement" });

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get("/emi-plans");
      if (res.data.success) setPlans(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = plans.filter(p => {
    const q = search.toLowerCase();
    return (
      !q ||
      p.transaction?.sellerAssociate?.name?.toLowerCase().includes(q) ||
      p.transaction?.buyer?.name?.toLowerCase().includes(q) ||
      String(p.id).includes(q)
    );
  });

  const statusSummary = (installments = []) => {
    const paid = installments.filter(i => i.status === "paid").length;
    const total = installments.length;
    return { paid, pending: total - paid, total };
  };

  return (
    <div style={{ padding: "28px", minHeight: "100vh" }}>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, color: "#D4AF37" }}>EMI Statements</h1>
          <p style={{ margin: "4px 0 0", color: "rgba(148,163,184,0.8)", fontSize: "14px" }}>
            View, manage and print complete EMI schedules for all associates
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "10px", padding: "8px 14px" }}>
          <Search size={16} color="#D4AF37" />
          <input
            placeholder="Search by name or ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: "transparent", border: "none", outline: "none", color: "white", fontSize: "14px", width: "220px" }}
          />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Total EMI Plans", value: plans.length, icon: FileText, color: "#3b82f6" },
          { label: "Total Installments", value: plans.reduce((s, p) => s + (p.installments?.length || 0), 0), icon: Clock, color: "#D4AF37" },
          { label: "Paid Installments", value: plans.reduce((s, p) => s + (p.installments?.filter(i => i.status === "paid").length || 0), 0), icon: CheckCircle2, color: "#22c55e" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}33`, borderRadius: "14px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "white" }}>{value}</p>
              <p style={{ margin: 0, fontSize: "13px", color: "rgba(148,163,184,0.7)" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.15)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(212,175,55,0.1)", display: "flex", alignItems: "center", gap: "10px" }}>
          <FileText size={18} color="#D4AF37" />
          <span style={{ color: "white", fontWeight: 700, fontSize: "15px" }}>All EMI Statements ({filtered.length})</span>
        </div>

        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "rgba(148,163,184,0.6)" }}>Loading statements…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "rgba(148,163,184,0.6)" }}>No EMI statements found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "rgba(212,175,55,0.06)" }}>
                  {["Plan ID", "Associate", "Client", "Total Amount", "Down Payment", "Monthly EMI", "Duration", "Progress", "Action"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#D4AF37", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => {
                  const { paid, pending, total } = statusSummary(p.installments);
                  const progress = total > 0 ? Math.round((paid / total) * 100) : 0;
                  return (
                    <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "12px 16px", color: "#D4AF37", fontWeight: 700 }}>#{p.id}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ color: "white", fontWeight: 600 }}>{p.transaction?.sellerAssociate?.name || "N/A"}</div>
                        <div style={{ color: "rgba(148,163,184,0.6)", fontSize: "11px" }}>{p.transaction?.sellerAssociate?.login_id || ""}</div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ color: "white", fontWeight: 600 }}>{p.transaction?.buyer?.name || "N/A"}</div>
                        <div style={{ color: "rgba(148,163,184,0.6)", fontSize: "11px" }}>{p.transaction?.buyer?.login_id || ""}</div>
                      </td>
                      <td style={{ padding: "12px 16px", color: "white", fontWeight: 600 }}>{inr(p.total_amount)}</td>
                      <td style={{ padding: "12px 16px", color: "#22c55e", fontWeight: 600 }}>{inr(p.down_payment)}</td>
                      <td style={{ padding: "12px 16px", color: "#D4AF37", fontWeight: 700 }}>{inr(p.monthly_amount)}/mo</td>
                      <td style={{ padding: "12px 16px", color: "rgba(148,163,184,0.8)" }}>{p.num_months} months</td>
                      <td style={{ padding: "12px 16px", minWidth: "130px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${progress}%`, background: progress === 100 ? "#22c55e" : "#D4AF37", borderRadius: "3px", transition: "width 0.5s" }} />
                          </div>
                          <span style={{ color: "rgba(148,163,184,0.8)", fontSize: "11px", whiteSpace: "nowrap" }}>{paid}/{total}</span>
                        </div>
                        <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.5)", marginTop: "3px" }}>{progress}% paid</div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          onClick={() => setSelectedPlan(p)}
                          style={{ background: "rgba(212,175,55,0.12)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)", padding: "7px 14px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "12px", transition: "all 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(212,175,55,0.25)"}
                          onMouseLeave={e => e.currentTarget.style.background = "rgba(212,175,55,0.12)"}
                        >
                          <Eye size={13} /> View & Print
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Print Modal */}
      {selectedPlan && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: "900px", height: "90vh", borderRadius: "16px", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 25px 80px rgba(0,0,0,0.5)" }}>

            {/* Modal header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", background: "#0b1437", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FileText size={20} color="#D4AF37" />
                <span style={{ color: "white", fontWeight: 700, fontSize: "16px" }}>EMI Statement Preview — #{selectedPlan.id}</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handlePrint}
                  style={{ background: "#D4AF37", color: "#0b1437", border: "none", padding: "9px 20px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "14px" }}
                >
                  <Printer size={16} /> Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedPlan(null)}
                  style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", padding: "9px 16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <X size={16} /> Close
                </button>
              </div>
            </div>

            {/* Scrollable print area */}
            <div style={{ flex: 1, overflowY: "auto", background: "#f8fafc" }}>
              <PrintStatement ref={printRef} plan={selectedPlan} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmiStatements;
