import {
  CalendarBlank,
  Download,
  TrendUp,
} from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Transaction {
  enrollment_id: string;
  course_title: string;
  student_name: string;
  amount_paid: number;
  enrolled_at: string;
}

export default function FinancialsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetch("/api/financials")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.transactions);
        setTotalRevenue(data.totalRevenue);
        setLoading(false);
      });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.heading}>Financials</Text>
          <Text style={styles.subheading}>Earnings &amp; Payouts</Text>
        </View>
        <TouchableOpacity style={styles.exportBtn}>
          <Download size={16} weight="bold" color="#374151" />
          <Text style={styles.exportBtnText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Revenue Banner */}
      <View style={styles.revenueBanner}>
        <Text style={styles.revenueBannerLabel}>Total Revenue</Text>
        <Text style={styles.revenueBannerValue}>
          ₦{totalRevenue.toLocaleString()}
        </Text>
        <View style={styles.trendBadge}>
          <TrendUp size={12} weight="bold" color="#fff" />
          <Text style={styles.trendBadgeText}>+12.5% this month</Text>
        </View>
      </View>

      {/* Mini Stats */}
      <View style={styles.miniGrid}>
        <View style={styles.miniCard}>
          <Text style={styles.miniLabel}>Pending</Text>
          <Text style={styles.miniValue}>
            ₦{(totalRevenue * 0.1).toLocaleString()}
          </Text>
          <Text style={styles.miniMeta}>Payout: Feb 28</Text>
        </View>
        <View style={styles.miniCard}>
          <Text style={styles.miniLabel}>Avg. Order</Text>
          <Text style={styles.miniValue}>₦15,000</Text>
        </View>
      </View>

      {/* Transactions */}
      <View style={styles.transactionsCard}>
        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator color="#0056D2" />
            <Text style={styles.centerText}>Loading transactions...</Text>
          </View>
        ) : transactions.length === 0 ? (
          <View style={styles.centerBox}>
            <Text style={styles.centerText}>No transactions yet.</Text>
          </View>
        ) : (
          transactions.map((tx) => (
            <View key={tx.enrollment_id} style={styles.txRow}>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle} numberOfLines={1}>
                  {tx.course_title}
                </Text>
                <Text style={styles.txStudent}>{tx.student_name}</Text>
                <View style={styles.txDate}>
                  <CalendarBlank size={12} color="#9ca3af" />
                  <Text style={styles.txDateText}>
                    {new Date(tx.enrolled_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.txRight}>
                <Text style={styles.txAmount}>
                  ₦{tx.amount_paid.toLocaleString()}
                </Text>
                <View style={styles.paidBadge}>
                  <Text style={styles.paidBadgeText}>PAID</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 32, gap: 20 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  subheading: { fontSize: 13, color: "#6b7280" },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportBtnText: { fontSize: 12, fontWeight: "bold", color: "#374151" },
  revenueBanner: {
    backgroundColor: "#0056D2",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#0056D2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  revenueBannerLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  revenueBannerValue: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 4,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 16,
  },
  trendBadgeText: { color: "#fff", fontSize: 12, fontWeight: "500" },
  miniGrid: { flexDirection: "row", gap: 12 },
  miniCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  miniLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  miniValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 4,
  },
  miniMeta: { fontSize: 12, color: "#9ca3af", marginTop: 4 },
  transactionsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  transactionsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  sectionTitle: { fontWeight: "bold", color: "#111827", fontSize: 15 },
  centerBox: { padding: 32, alignItems: "center", gap: 8 },
  centerText: { color: "#6b7280", fontSize: 13 },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  txInfo: { flex: 1, paddingRight: 16 },
  txTitle: { fontSize: 14, fontWeight: "bold", color: "#111827" },
  txStudent: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  txDate: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  txDateText: { fontSize: 11, color: "#9ca3af" },
  txRight: { alignItems: "flex-end", gap: 4 },
  txAmount: { fontSize: 14, fontWeight: "bold", color: "#111827" },
  paidBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paidBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#16a34a",
    letterSpacing: 0.5,
  },
});
