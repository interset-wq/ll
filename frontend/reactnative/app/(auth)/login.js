import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../_layout';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#6366f1', '#818cf8']}
        style={styles.topSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.logoWrap}>
          <MaterialCommunityIcons name="book-open-page-variant" size={36} color="#fff" />
        </View>
        <Text style={styles.brandTitle}>Learning Log</Text>
        <Text style={styles.brandSubtitle}>Capture your knowledge</Text>
      </LinearGradient>

      <View style={styles.bottomSection}>
        <Text style={styles.welcomeBack}>Welcome back</Text>
        <Text style={styles.signInLabel}>Sign in to continue</Text>

        {error ? (
          <View style={styles.errorBox}>
            <MaterialCommunityIcons name="alert-circle" size={18} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TextInput
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          placeholder="Username"
          autoCapitalize="none"
          left={<TextInput.Icon icon="account-outline" color="#94A3B8" />}
          outlineColor="#E2E8F0"
          activeOutlineColor="#6366f1"
          style={styles.input}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          placeholder="Password"
          secureTextEntry={!showPassword}
          left={<TextInput.Icon icon="lock-outline" color="#94A3B8" />}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              color="#94A3B8"
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          outlineColor="#E2E8F0"
          activeOutlineColor="#6366f1"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading || !username || !password}
          buttonColor="#6366f1"
          style={styles.loginBtn}
          contentStyle={{ height: 50 }}
        >
          Sign In
        </Button>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text style={styles.registerLink}>Create one</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topSection: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandTitle: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  brandSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  bottomSection: { flex: 1, padding: 28, paddingTop: 32 },
  welcomeBack: { fontSize: 22, fontWeight: '700', color: '#0F172A' },
  signInLabel: { fontSize: 14, color: '#94A3B8', marginTop: 4, marginBottom: 24 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: { fontSize: 13, color: '#EF4444', flex: 1 },
  input: { backgroundColor: '#fff', marginBottom: 12 },
  loginBtn: { borderRadius: 12, marginTop: 4 },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: { fontSize: 14, color: '#94A3B8' },
  registerLink: { fontSize: 14, fontWeight: '600', color: '#6366f1' },
});
