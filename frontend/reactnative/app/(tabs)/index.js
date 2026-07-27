import { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header greeting */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good {getTimeOfDay()},</Text>
          <Text style={styles.username}>{user?.username}</Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="bell-outline" size={22} color="#64748B" />
        </View>
      </View>

      {/* Stats cards */}
      <View style={styles.statsRow}>
        <LinearGradient
          colors={['#6366f1', '#818cf8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statCard}
        >
          <View style={styles.statIconWrap}>
            <MaterialCommunityIcons name="book-open-variant" size={20} color="#fff" />
          </View>
          <Text style={styles.statValue}>{stats.topics}</Text>
          <Text style={styles.statLabel}>Topics</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#f59e0b', '#fbbf24']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statCard}
        >
          <View style={styles.statIconWrap}>
            <MaterialCommunityIcons name="text-box-multiple" size={20} color="#fff" />
          </View>
          <Text style={styles.statValue}>{stats.entries}</Text>
          <Text style={styles.statLabel}>Entries</Text>
        </LinearGradient>
      </View>

      {/* Recent Topics */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Topics</Text>
          <Pressable onPress={() => router.push('/(tabs)/topics')}>
            <Text style={styles.sectionLink}>See all</Text>
          </Pressable>
        </View>
        {recentTopics.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons name="folder-open-outline" size={32} color="#D1D5DB" />
            <Text style={styles.emptyText}>No topics yet</Text>
          </View>
        ) : (
          recentTopics.map((topic) => (
            <Pressable
              key={topic.id}
              style={({ pressed }) => [styles.topicCard, pressed && styles.pressed]}
              onPress={() => router.push(`/topic/${topic.id}`)}
            >
              <View style={styles.topicIcon}>
                <MaterialCommunityIcons name="book-open-variant" size={18} color="#6366f1" />
              </View>
              <View style={styles.topicInfo}>
                <Text style={styles.topicTitle} numberOfLines={1}>{topic.text}</Text>
                <Text style={styles.topicMeta}>{topic.entry_count} {topic.entry_count === 1 ? 'entry' : 'entries'}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
            </Pressable>
          ))
        )}
      </View>

      {/* Recent Entries */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          <Pressable onPress={() => router.push('/(tabs)/topics')}>
            <Text style={styles.sectionLink}>See all</Text>
          </Pressable>
        </View>
        {recentEntries.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons name="text-box-outline" size={32} color="#D1D5DB" />
            <Text style={styles.emptyText}>No entries yet</Text>
          </View>
        ) : (
          recentEntries.map((entry) => (
            <Pressable
              key={entry.id}
              style={({ pressed }) => [styles.entryCard, pressed && styles.pressed]}
              onPress={() => router.push(`/entry/${entry.id}`)}
            >
              <Text style={styles.entryTitle} numberOfLines={1}>{entry.display_title}</Text>
              <View style={styles.entryMeta}>
                <Text style={styles.entryTopic}>{entry.topic_text}</Text>
                <Text style={styles.entryDot}>·</Text>
                <Text style={styles.entryDate}>{formatDate(entry.date_added)}</Text>
              </View>
            </Pressable>
          ))
        )}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  if (diff < 86400000) return 'Today';
  if (diff < 172800000) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingTop: 8 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: { fontSize: 15, color: '#94A3B8', fontWeight: '500' },
  username: { fontSize: 26, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: { fontSize: 30, fontWeight: '800', color: '#fff', marginTop: 8 },
  statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  sectionLink: { fontSize: 13, fontWeight: '600', color: '#6366f1' },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  pressed: { opacity: 0.6, transform: [{ scale: 0.98 }] },
  topicIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicInfo: { flex: 1 },
  topicTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  topicMeta: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  entryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  entryTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A', marginBottom: 4 },
  entryMeta: { flexDirection: 'row', alignItems: 'center' },
  entryTopic: { fontSize: 12, color: '#6366f1', fontWeight: '500' },
  entryDot: { fontSize: 12, color: '#CBD5E1', marginHorizontal: 6 },
  entryDate: { fontSize: 12, color: '#94A3B8' },
  emptyCard: {
    backgroundColor: '#F1F5F9',
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: { fontSize: 13, color: '#94A3B8', marginTop: 8 },
});
