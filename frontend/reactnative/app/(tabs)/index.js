import { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { topics, entries } from '../../lib/api';
import { useAuth } from '../_layout';

export default function DashboardScreen() {
  const [recentTopics, setRecentTopics] = useState([]);
  const [recentEntries, setRecentEntries] = useState([]);
  const [stats, setStats] = useState({ topics: 0, entries: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const loadData = useCallback(async () => {
    try {
      const [topicsRes, entriesRes] = await Promise.all([
        topics.list(),
        entries.list(),
      ]);
      setRecentTopics(topicsRes.data.results.slice(0, 5));
      setRecentEntries(entriesRes.data.results.slice(0, 5));
      setStats({ topics: topicsRes.data.count, entries: entriesRes.data.count });
    } catch {} finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, []);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  if (loading) return <ActivityIndicator style={styles.loading} size="large" />;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text variant="headlineSmall" style={styles.greeting}>
        Welcome, {user?.username}!
      </Text>

      <View style={styles.statsRow}>
        <StatCard label="Topics" value={stats.topics} color="#6366f1" />
        <StatCard label="Entries" value={stats.entries} color="#3b82f6" />
      </View>

      <Text variant="titleMedium" style={styles.sectionTitle}>Recent Topics</Text>
      {recentTopics.map((topic) => (
        <Card
          key={topic.id}
          style={styles.item}
          onPress={() => router.push(`/topic/${topic.id}`)}
        >
          <Card.Content>
            <Text variant="titleSmall" numberOfLines={1}>{topic.text}</Text>
            <Text variant="bodySmall" style={styles.meta}>{topic.entry_count} entries</Text>
          </Card.Content>
        </Card>
      ))}

      <Text variant="titleMedium" style={styles.sectionTitle}>Recent Entries</Text>
      {recentEntries.map((entry) => (
        <Card
          key={entry.id}
          style={styles.item}
          onPress={() => router.push(`/entry/${entry.id}`)}
        >
          <Card.Content>
            <Text variant="titleSmall" numberOfLines={1}>{entry.display_title}</Text>
            <Text variant="bodySmall" style={styles.meta}>
              {entry.topic_text} · {new Date(entry.date_added).toLocaleDateString()}
            </Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

function StatCard({ label, value, color }) {
  return (
    <Card style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <Card.Content>
        <Text variant="headlineMedium" style={{ fontWeight: 'bold', color }}>{value}</Text>
        <Text variant="bodySmall" style={styles.meta}>{label}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center' },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  greeting: { fontWeight: 'bold', marginBottom: 16, padding: 16, paddingBottom: 0 },
  statsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 20 },
  statCard: { flex: 1, elevation: 1 },
  sectionTitle: { fontWeight: '600', marginTop: 8, marginBottom: 8, paddingHorizontal: 16 },
  item: { marginBottom: 8, marginHorizontal: 16, elevation: 1 },
  meta: { color: '#666', marginTop: 2 },
});
