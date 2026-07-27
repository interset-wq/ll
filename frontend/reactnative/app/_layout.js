import { useEffect, useState, createContext, useContext } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../lib/api';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6366f1',
    secondary: '#818cf8',
  },
};

function RootLayoutNav() {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="topic/[id]" options={{ headerShown: true, title: 'Topic' }} />
      <Stack.Screen name="entry/[id]" options={{ headerShown: true, title: 'Entry' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        const res = await auth.me();
        setUser(res.data);
      } catch {
        await AsyncStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    const res = await auth.login(username, password);
    await AsyncStorage.setItem('token', res.data.token);
    setUser({ id: res.data.id, username: res.data.username, email: res.data.email });
  };

  const register = async (username, email, password) => {
    const res = await auth.register(username, email, password);
    await AsyncStorage.setItem('token', res.data.token);
    setUser({ id: res.data.id, username: res.data.username, email: res.data.email });
  };

  const logout = async () => {
    try { await auth.logout(); } catch {}
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      <PaperProvider theme={theme}>
        <StatusBar style="dark" />
        <RootLayoutNav />
      </PaperProvider>
    </AuthContext.Provider>
  );
}
