import {
  Books,
  CaretRight,
  CurrencyDollar,
  TrendUp,
  Users,
} from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DashboardPage() {
  const [stats, setStats] = useState({ students: 0, courses: 0, revenue: 0 });

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error);
  }, []);

  const statCards = [
    {
      label: "Total Revenue",
      value: `₦${stats.revenue.toLocaleString()}`,
      Icon: CurrencyDollar,
      color: "#0056D2",
    },
    {
      label: "Active Students",
      value: stats.students.toLocaleString(),
      Icon: Users,
      color: "#0056D2",
    },
    {
      label: "Total Courses",
      value: String(stats.courses),
      Icon: Books,
      color: "#0056D2",
    },
    {
      label: "Completion Rate",
      value: "84%",
      Icon: TrendUp,
      color: "#16a34a",
    },
  ];

  // Simple bar chart data
  const chartData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 2000 },
    { name: "Apr", value: 2780 },
    { name: "May", value: 1890 },
    { name: "Jun", value: 2390 },
    { name: "Jul", value: 3490 },
  ];
  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Overview header */}
      <View style={styles.headerSection}>
        <Text style={styles.heading}>Overview</Text>
        <Text style={styles.subheading}>Here's what's happening today.</Text>
      </View>

      {/* Stat cards grid */}
      <View style={styles.grid}>
        {statCards.map((stat) => (
          <View key={stat.label} style={styles.card}>
            <stat.Icon size={24} color={stat.color} weight="duotone" />
            <Text style={styles.cardValue}>{stat.value}</Text>
            <Text style={styles.cardLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Revenue Trend */}
      <View style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Revenue Trend</Text>
        <View style={styles.chart}>
          {chartData.map((d) => (
            <View key={d.name} style={styles.barCol}>
              <View
                style={[
                  styles.bar,
                  { height: Math.round((d.value / maxValue) * 120) },
                ]}
              />
              <Text style={styles.barLabel}>{d.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityCard}>
        <View style={styles.activityHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={styles.activityRow}>
            <View style={styles.activityAvatar}>
              <Text style={styles.activityAvatarText}>JD</Text>
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle} numberOfLines={1}>
                John Doe enrolled in "AI Video Making"
              </Text>
              <Text style={styles.activityTime}>2m ago</Text>
            </View>
            <CaretRight size={16} color="#9ca3af" />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 20,
  },
  headerSection: {
    gap: 4,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  subheading: {
    fontSize: 13,
    color: "#6b7280",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    width: "47%",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },
  cardLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  chartCard: {
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 140,
    paddingTop: 16,
  },
  barCol: {
    alignItems: "center",
    flex: 1,
    gap: 6,
  },
  bar: {
    width: 24,
    backgroundColor: "#0056D2",
    borderRadius: 4,
    opacity: 0.85,
  },
  barLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  activityCard: {
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
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  viewAll: {
    fontSize: 12,
    color: "#0056D2",
    fontWeight: "600",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  activityAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  activityAvatarText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4b5563",
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
  },
  activityTime: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
});
