import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../_layout';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
    } catch (err) {
      const data = err.response?.data;
      if (data?.username) setError(data.username[0]);
      else if (data?.password) setError(data.password[0]);
      else setError('Registration failed');
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
          <MaterialCommunityIcons name="account-plus" size={32} color="#fff" />
        </View>
        <Text style={styles.brandTitle}>Create Account</Text>
        <Text style={styles.brandSubtitle}>Start your learning journey</Text>
      </LinearGradient>

      <View style={styles.bottomSection}>
        <Text style={styles.welcomeBack}>Get started</Text>
        <Text style={styles.signInLabel}>Fill in your details below</Text>

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
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          placeholder="Email (optional)"
          autoCapitalize="none"
          keyboardType="email-address"
          left={<TextInput.Icon icon="email-outline" color="#94A3B8" />}
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
          onPress={handleRegister}
          loading={loading}
          disabled={loading || !username || !password}
          buttonColor="#6366f1"
          style={styles.loginBtn}
          contentStyle={{ height: 50 }}
        >
          Create Account
        </Button>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={styles.registerLink}>Sign in</Text>
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
  bottomSection: { flex: 1, padding: 28, paddingTop: 28 },
  welcomeBack: { fontSize: 22, fontWeight: '700', color: '#0F172A' },
  signInLabel: { fontSize: 14, color: '#94A3B8', marginTop: 4, marginBottom: 20 },
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
    marginTop: 20,
  },
  registerText: { fontSize: 14, color: '#94A3B8' },
  registerLink: { fontSize: 14, fontWeight: '600', color: '#6366f1' },
});
