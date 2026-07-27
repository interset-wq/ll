import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../_layout';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Avatar.Text size={64} label={user?.username?.[0]?.toUpperCase() || '?'} style={styles.avatar} />
          <Text variant="headlineSmall" style={styles.name}>{user?.username}</Text>
          <Text variant="bodyMedium" style={styles.email}>{user?.email || 'No email set'}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <InfoRow icon="account" label="Username" value={user?.username} />
          <InfoRow icon="email" label="Email" value={user?.email || 'Not set'} />
          <InfoRow icon="calendar" label="Joined" value={user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : ''} />
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={logout}
        icon="logout"
        style={styles.logoutButton}
        textColor="#ef4444"
      >
        Logout
      </Button>
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name={icon} size={20} color="#999" />
      <View style={styles.infoText}>
        <Text variant="bodySmall" style={styles.infoLabel}>{label}</Text>
        <Text variant="bodyMedium">{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: { marginBottom: 16, elevation: 2 },
  cardContent: { alignItems: 'center', paddingVertical: 24 },
  avatar: { backgroundColor: '#e0e7ff', marginBottom: 12 },
  name: { fontWeight: 'bold', marginBottom: 4 },
  email: { color: '#666' },
  infoCard: { marginBottom: 16, elevation: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  infoText: { flex: 1 },
  infoLabel: { color: '#999' },
  logoutButton: { borderColor: '#ef4444' },
});
