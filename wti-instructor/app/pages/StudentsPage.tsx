import {
  Calendar,
  Envelope,
  MagnifyingGlass,
  Phone,
  User,
} from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

interface Student {
  user_id: string;
  name: string;
  email: string;
  phone_number: string;
  created_at: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      });
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View>
        <Text style={styles.heading}>Students</Text>
        <Text style={styles.subheading}>Manage your student base</Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <MagnifyingGlass size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search students..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      <View style={styles.list}>
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator color="#0056D2" />
            <Text style={styles.centerText}>Loading students...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No students found.</Text>
          </View>
        ) : (
          filtered.map((student) => (
            <View key={student.user_id} style={styles.card}>
              {/* Avatar */}
              <View style={styles.avatar}>
                {student.name ? (
                  <Text style={styles.avatarText}>{student.name[0]}</Text>
                ) : (
                  <User size={24} color="#0056D2" />
                )}
              </View>

              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <View>
                    <Text style={styles.name} numberOfLines={1}>
                      {student.name}
                    </Text>
                    <Text style={styles.userId}>
                      ID: {student.user_id.slice(0, 8)}
                    </Text>
                  </View>
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>Active</Text>
                  </View>
                </View>

                <View style={styles.details}>
                  <View style={styles.detailRow}>
                    <Envelope size={16} color="#9ca3af" />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {student.email}
                    </Text>
                  </View>
                  {student.phone_number ? (
                    <View style={styles.detailRow}>
                      <Phone size={16} color="#9ca3af" />
                      <Text style={styles.detailText}>
                        {student.phone_number}
                      </Text>
                    </View>
                  ) : null}
                  <View style={styles.detailRow}>
                    <Calendar size={14} color="#9ca3af" />
                    <Text style={styles.detailTextSmall}>
                      Joined{" "}
                      {new Date(student.created_at).toLocaleDateString()}
                    </Text>
                  </View>
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
  content: { padding: 16, paddingBottom: 32, gap: 16 },
  heading: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  subheading: { fontSize: 13, color: "#6b7280" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  list: { gap: 12 },
  centerBox: { alignItems: "center", paddingVertical: 32, gap: 8 },
  centerText: { color: "#6b7280", fontSize: 14 },
  emptyBox: {
    alignItems: "center",
    paddingVertical: 48,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#e5e7eb",
  },
  emptyText: { color: "#6b7280" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: { color: "#0056D2", fontWeight: "bold", fontSize: 18 },
  info: { flex: 1 },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: { fontWeight: "bold", color: "#111827", fontSize: 14 },
  userId: { fontSize: 11, color: "#9ca3af", fontFamily: "monospace", marginTop: 2 },
  activeBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  activeBadgeText: { fontSize: 11, fontWeight: "600", color: "#166534" },
  details: { marginTop: 12, gap: 6 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailText: { fontSize: 13, color: "#4b5563", flex: 1 },
  detailTextSmall: { fontSize: 11, color: "#9ca3af" },
});
