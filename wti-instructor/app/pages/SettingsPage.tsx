import { FloppyDisk, Lock, User } from "phosphor-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

const TABS = ["Profile", "Security", "Notifications"] as const;
type Tab = (typeof TABS)[number];

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  const handleSubmit = () => {
    Alert.alert("Success", "Profile updated successfully!");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View>
        <Text style={styles.heading}>Settings</Text>
        <Text style={styles.subheading}>Account preferences</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        {/* Tabs */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === "Profile" && (
            <View style={styles.form}>
              {/* Full Name */}
              <View style={styles.field}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputRow}>
                  <User size={20} color="#9ca3af" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(v) => setFormData({ ...formData, name: v })}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.field}>
                <Text style={styles.label}>Email Address</Text>
                <View style={[styles.inputRow, styles.inputRowDisabled]}>
                  <User size={20} color="#9ca3af" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.inputDisabled]}
                    value={formData.email}
                    editable={false}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                <Text style={styles.hint}>Contact support to change email.</Text>
              </View>

              {/* Change Password */}
              <View style={styles.passwordSection}>
                <Text style={styles.passwordTitle}>Change Password</Text>

                <View style={styles.field}>
                  <Text style={styles.label}>Current Password</Text>
                  <View style={styles.inputRow}>
                    <Lock size={20} color="#9ca3af" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={formData.currentPassword}
                      onChangeText={(v) =>
                        setFormData({ ...formData, currentPassword: v })
                      }
                      secureTextEntry
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>New Password</Text>
                  <View style={styles.inputRow}>
                    <Lock size={20} color="#9ca3af" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={formData.newPassword}
                      onChangeText={(v) =>
                        setFormData({ ...formData, newPassword: v })
                      }
                      secureTextEntry
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
                <FloppyDisk size={20} weight="bold" color="#fff" />
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === "Security" && (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Security settings coming soon.</Text>
            </View>
          )}

          {activeTab === "Notifications" && (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                Notification settings coming soon.
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 40, gap: 20 },
  heading: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  subheading: { fontSize: 13, color: "#6b7280" },
  card: {
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
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#0056D2",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  tabTextActive: {
    color: "#0056D2",
    fontWeight: "bold",
  },
  tabContent: { padding: 16 },
  form: { gap: 20 },
  field: { gap: 4 },
  label: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 12,
    gap: 8,
  },
  inputRowDisabled: { backgroundColor: "#f3f4f6" },
  inputIcon: {},
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  inputDisabled: { color: "#6b7280" },
  hint: { fontSize: 12, color: "#9ca3af", marginTop: 4 },
  passwordSection: {
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  passwordTitle: { fontSize: 14, fontWeight: "bold", color: "#111827" },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0056D2",
    paddingVertical: 14,
    borderRadius: 8,
  },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  placeholder: { paddingVertical: 40, alignItems: "center" },
  placeholderText: { color: "#6b7280", fontSize: 14 },
});
