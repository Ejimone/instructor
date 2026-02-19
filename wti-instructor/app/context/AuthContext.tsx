// @ts-ignore – install @types/react-native-async-storage or the package includes types
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  user_id: string;
  name: string;
  email: string;
  role: string;
  profile_photo_url?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem("wti_user").then((stored: string | null) => {
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        router.replace("/pages/LoginPage");
      }
    });
  }, []);

  const login = async (userData: User) => {
    setUser(userData);
    await AsyncStorage.setItem("wti_user", JSON.stringify(userData));
    router.replace("/");
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("wti_user");
    router.replace("/pages/LoginPage");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
