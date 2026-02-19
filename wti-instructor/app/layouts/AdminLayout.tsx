import { Slot, usePathname, useRouter } from "expo-router";
import {
  Bell,
  Books,
  CurrencyDollar,
  Gear,
  House,
  List,
  SignOut,
  Student,
  X,
} from "phosphor-react-native";
import React, { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

interface NavItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
}

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const navItems: NavItem[] = [
    { icon: House, label: "Dashboard", path: "/" },
    { icon: Books, label: "Courses", path: "/courses" },
    { icon: Student, label: "Students", path: "/students" },
    { icon: CurrencyDollar, label: "Financials", path: "/financials" },
    { icon: Gear, label: "Settings", path: "/settings" },
  ];

  const getCurrentTitle = () => {
    const current = navItems.find((item) => item.path === pathname);
    if (current) return current.label;
    if (pathname.startsWith("/courses/")) return "Course Editor";
    return "WTI Admin";
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setIsSidebarOpen(false));
  };

  const navigate = (path: string) => {
    closeSidebar();
    router.push(path as any);
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={openSidebar}>
          <List size={24} weight="bold" color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {getCurrentTitle()}
        </Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Bell size={24} weight="bold" color="#374151" />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      {/* Overlay */}
      {isSidebarOpen && (
        <Animated.View
          style={[styles.overlay, { opacity: overlayAnim }]}
          pointerEvents="auto"
        >
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeSidebar} />
        </Animated.View>
      )}

      {/* Sidebar */}
      <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
      >
        {/* Sidebar Header */}
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarLogo}>WTI Platform</Text>
          <TouchableOpacity onPress={closeSidebar} style={styles.closeBtn}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.[0] || "A"}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>{user?.name}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{user?.email}</Text>
          </View>
        </View>

        {/* Nav Items */}
        <View style={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <TouchableOpacity
                key={item.path}
                onPress={() => navigate(item.path)}
                style={[styles.navItem, isActive && styles.navItemActive]}
              >
                <item.icon
                  size={22}
                  weight={isActive ? "fill" : "regular"}
                  color={isActive ? "#fff" : "#374151"}
                />
                <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <SignOut size={22} color="#dc2626" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Main Content */}
      <View style={styles.content}>
        <Slot />
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <TouchableOpacity
              key={item.path}
              style={styles.bottomNavItem}
              onPress={() => router.push(item.path as any)}
            >
              <item.icon
                size={24}
                weight={isActive ? "fill" : "regular"}
                color={isActive ? "#0056D2" : "#6b7280"}
              />
              <Text
                style={[
                  styles.bottomNavLabel,
                  isActive && styles.bottomNavLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    height: 64,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 30,
  },
  headerBtn: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0056D2",
    flex: 1,
    textAlign: "center",
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: "#ef4444",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#fff",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 40,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 288,
    backgroundColor: "#fff",
    zIndex: 50,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  sidebarHeader: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  sidebarLogo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0056D2",
  },
  closeBtn: {
    padding: 8,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0056D2",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: "600",
    color: "#111827",
    fontSize: 14,
  },
  userEmail: {
    fontSize: 12,
    color: "#6b7280",
  },
  nav: {
    flex: 1,
    padding: 16,
    gap: 4,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: "#0056D2",
  },
  navLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  navLabelActive: {
    color: "#fff",
  },
  logoutSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#dc2626",
  },
  content: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 64,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    zIndex: 30,
  },
  bottomNavItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: "100%",
    gap: 2,
  },
  bottomNavLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#6b7280",
  },
  bottomNavLabelActive: {
    color: "#0056D2",
  },
});
