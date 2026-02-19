import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  DotsSixVertical,
  FloppyDisk,
  Plus,
  VideoCamera,
} from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

// Simple picker fallback using buttons
const CATEGORIES = [
  { value: "content_creation", label: "Content Creation" },
  { value: "ai_tools", label: "AI Tools" },
  { value: "development", label: "Development" },
  { value: "video_production", label: "Video Production" },
];

export default function CourseEditorPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isNew = !id || id === "new";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "0",
    category: "content_creation",
    is_published: false,
  });

  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/courses/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            title: data.title,
            description: data.description,
            price: String(data.price),
            category: data.category,
            is_published: !!data.is_published,
          });
          setModules(data.modules || []);
        });
    }
  }, [id, isNew]);

  const handleSubmit = async () => {
    setLoading(true);
    const url = isNew ? "/api/courses" : `/api/courses/${id}`;
    const method = isNew ? "POST" : "PUT";
    const body = {
      ...formData,
      price: Number(formData.price),
      instructor_id: user?.user_id,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (isNew && data.course_id) {
        router.replace(`/courses/${data.course_id}` as any);
      } else {
        Alert.alert("Saved", "Course saved successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addModule = () => {
    if (isNew) {
      Alert.alert("Save First", "Please save the course first.");
      return;
    }
    Alert.prompt(
      "Add Module",
      "Enter module title:",
      async (title) => {
        if (!title) return;
        const res = await fetch(`/api/courses/${id}/modules`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        });
        if (res.ok) {
          const updated = await fetch(`/api/courses/${id}`).then((r) => r.json());
          setModules(updated.modules);
        }
      }
    );
  };

  const addLesson = (moduleId: string) => {
    Alert.prompt(
      "Add Lesson",
      "Enter lesson title:",
      async (title) => {
        if (!title) return;
        const res = await fetch(`/api/modules/${moduleId}/lessons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            video_url: "https://example.com/video",
            duration_seconds: 300,
            course_id: id,
          }),
        });
        if (res.ok) {
          const updated = await fetch(`/api/courses/${id}`).then((r) => r.json());
          setModules(updated.modules);
        }
      }
    );
  };

  const selectedCategory =
    CATEGORIES.find((c) => c.value === formData.category)?.label ?? formData.category;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>{isNew ? "New Course" : "Edit Course"}</Text>
        </View>
        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <FloppyDisk size={20} weight="bold" color="#fff" />
              <Text style={styles.saveBtnText}>Save</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Basic Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Info</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(v) => setFormData({ ...formData, title: v })}
            placeholder="e.g. Master AI Video Creation"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={formData.description}
            onChangeText={(v) => setFormData({ ...formData, description: v })}
            placeholder="What will students learn?"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Price (₦)</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(v) => setFormData({ ...formData, price: v })}
              keyboardType="numeric"
              placeholderTextColor="#9ca3af"
            />
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity
              style={styles.pickerBtn}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            >
              <Text style={styles.pickerBtnText}>{selectedCategory}</Text>
            </TouchableOpacity>
            {showCategoryPicker && (
              <View style={styles.pickerDropdown}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.value}
                    style={styles.pickerOption}
                    onPress={() => {
                      setFormData({ ...formData, category: cat.value });
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        formData.category === cat.value &&
                        styles.pickerOptionActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Publish Course</Text>
          <Switch
            value={formData.is_published}
            onValueChange={(v) => setFormData({ ...formData, is_published: v })}
            trackColor={{ false: "#d1d5db", true: "#0056D2" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Curriculum */}
      <View style={styles.section}>
        <View style={styles.curriculumHeader}>
          <Text style={styles.sectionTitle}>Curriculum</Text>
          <TouchableOpacity style={styles.addModuleBtn} onPress={addModule}>
            <Plus size={16} weight="bold" color="#0056D2" />
            <Text style={styles.addModuleBtnText}>Module</Text>
          </TouchableOpacity>
        </View>

        {modules.length === 0 ? (
          <View style={styles.emptyModules}>
            <Text style={styles.emptyModulesText}>No modules yet.</Text>
          </View>
        ) : (
          modules.map((module) => (
            <View key={module.module_id} style={styles.moduleCard}>
              <View style={styles.moduleHeader}>
                <View style={styles.moduleHeaderLeft}>
                  <DotsSixVertical size={20} color="#9ca3af" />
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                </View>
                <TouchableOpacity
                  style={styles.addLessonBtn}
                  onPress={() => addLesson(module.module_id)}
                >
                  <Text style={styles.addLessonBtnText}>+ Lesson</Text>
                </TouchableOpacity>
              </View>
              {module.lessons?.map((lesson: any) => (
                <View key={lesson.lesson_id} style={styles.lessonRow}>
                  <VideoCamera size={18} weight="fill" color="#9ca3af" />
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                </View>
              ))}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 40, gap: 20 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  backBtn: { padding: 8, borderRadius: 999 },
  topTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0056D2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: { fontWeight: "bold", color: "#111827", fontSize: 15 },
  field: { gap: 4 },
  label: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    fontSize: 15,
    color: "#111827",
  },
  textarea: { height: 80, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 12 },
  pickerBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  pickerBtnText: { fontSize: 14, color: "#111827" },
  pickerDropdown: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    zIndex: 100,
    overflow: "hidden",
  },
  pickerOption: { padding: 12 },
  pickerOptionText: { fontSize: 14, color: "#374151" },
  pickerOptionActive: { color: "#0056D2", fontWeight: "bold" },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  toggleLabel: { fontSize: 14, fontWeight: "bold", color: "#374151" },
  curriculumHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addModuleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  addModuleBtnText: { fontSize: 13, color: "#0056D2", fontWeight: "bold" },
  emptyModules: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#e5e7eb",
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyModulesText: { color: "#6b7280", fontSize: 13 },
  moduleCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
  },
  moduleHeader: {
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  moduleHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  moduleTitle: { fontWeight: "bold", color: "#111827", fontSize: 13 },
  addLessonBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  addLessonBtnText: { fontSize: 12, fontWeight: "500", color: "#374151" },
  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingLeft: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#fff",
  },
  lessonTitle: { fontSize: 13, color: "#374151", fontWeight: "500" },
});
