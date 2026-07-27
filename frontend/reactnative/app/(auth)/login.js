import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { Link } from 'expo-router';
import { useAuth } from '../_layout';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      <View style={styles.inner}>
        <Text variant="headlineLarge" style={styles.title}>Learning Log</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>Sign in to continue</Text>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              mode="outlined"
              autoCapitalize="none"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
            />
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading || !username || !password}
              style={styles.button}
            >
              Sign In
            </Button>
            <Link href="/(auth)/register" asChild>
              <Button mode="text">Don't have an account? Create one</Button>
            </Link>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { textAlign: 'center', fontWeight: 'bold', color: '#6366f1', marginBottom: 4 },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: 24 },
  card: { elevation: 2 },
  cardContent: { gap: 12, padding: 8 },
  error: { color: '#ef4444', textAlign: 'center', marginBottom: 4 },
  button: { marginTop: 4 },
});
