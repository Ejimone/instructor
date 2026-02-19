import { useRouter } from "expo-router";
import {
  DotsThreeVertical,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Trash,
} from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Course {
  course_id: string;
  title: string;
  category: string;
  price: number;
  is_published: number;
  created_at: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      });
  }, []);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.heading}>My Courses</Text>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => router.push("/courses/new" as any)}
        >
          <Plus size={18} weight="bold" color="#fff" />
          <Text style={styles.createBtnText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <MagnifyingGlass size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
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
            <Text style={styles.centerText}>Loading courses...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No courses yet</Text>
            <TouchableOpacity onPress={() => router.push("/courses/new" as any)}>
              <Text style={styles.emptyLink}>Create your first course</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((course) => (
            <View key={course.course_id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.cardLeft}>
                  <View style={styles.initials}>
                    <Text style={styles.initialsText}>{course.title[0]}</Text>
                  </View>
                  <View>
                    <Text style={styles.courseTitle} numberOfLines={1}>
                      {course.title}
                    </Text>
                    <Text style={styles.courseCategory}>{course.category}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.menuBtn}>
                  <DotsThreeVertical size={24} weight="bold" color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <View style={styles.cardBottom}>
                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.badge,
                      course.is_published ? styles.badgeGreen : styles.badgeYellow,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        course.is_published
                          ? styles.badgeTextGreen
                          : styles.badgeTextYellow,
                      ]}
                    >
                      {course.is_published ? "Published" : "Draft"}
                    </Text>
                  </View>
                  <Text style={styles.price}>
                    ₦{course.price?.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() =>
                      router.push(`/courses/${course.course_id}` as any)
                    }
                  >
                    <PencilSimple size={18} weight="bold" color="#0056D2" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn}>
                    <Trash size={18} weight="bold" color="#dc2626" />
                  </TouchableOpacity>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0056D2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
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
  emptyText: { color: "#6b7280", marginBottom: 8 },
  emptyLink: { color: "#0056D2", fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardLeft: { flexDirection: "row", gap: 12, flex: 1 },
  initials: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: { color: "#0056D2", fontWeight: "bold", fontSize: 18 },
  courseTitle: { fontWeight: "bold", color: "#111827", fontSize: 14 },
  courseCategory: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  menuBtn: { padding: 4 },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f9fafb",
    paddingTop: 8,
  },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeGreen: { backgroundColor: "#dcfce7" },
  badgeYellow: { backgroundColor: "#fef9c3" },
  badgeText: { fontSize: 12, fontWeight: "600" },
  badgeTextGreen: { color: "#166534" },
  badgeTextYellow: { color: "#854d0e" },
  price: { fontSize: 14, fontWeight: "bold", color: "#111827" },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  editBtn: {
    padding: 8,
    backgroundColor: "#eff6ff",
    borderRadius: 999,
  },
  deleteBtn: {
    padding: 8,
    backgroundColor: "#fef2f2",
    borderRadius: 999,
  },
});
