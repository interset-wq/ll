import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert, Pressable } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { topics, entries } from '../../lib/api';

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams();
  const [topic, setTopic] = useState(null);
  const [entryList, setEntryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => { loadData(); }, [id]);

  const loadData = async () => {
    try {
      const [topicRes, entriesRes] = await Promise.all([
        topics.get(Number(id)),
        entries.list({ topic: Number(id) }),
      ]);
      setTopic(topicRes.data);
      setEntryList(entriesRes.data.results);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Topic', `Delete "${topic?.text}" and all its entries?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await topics.delete(Number(id));
          router.back();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBadge}>
            <MaterialCommunityIcons name="book-open-variant" size={22} color="#6366f1" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={2}>{topic?.text}</Text>
            <Text style={styles.subtitle}>{entryList.length} {entryList.length === 1 ? 'entry' : 'entries'}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconBtn}>
            <MaterialCommunityIcons name="pencil-outline" size={18} color="#64748B" />
          </Pressable>
          <Pressable style={[styles.iconBtn, styles.deleteBtn]} onPress={handleDelete}>
            <MaterialCommunityIcons name="delete-outline" size={18} color="#EF4444" />
          </Pressable>
        </View>
      </View>

      {/* Entry list */}
      <FlatList
        data={entryList}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Pressable
            style={({ pressed }) => [styles.entryCard, pressed && styles.pressed]}
            onPress={() => router.push(`/entry/${item.id}`)}
          >
            <View style={styles.entryLeft}>
              <Text style={styles.entryNumber}>{String(index + 1).padStart(2, '0')}</Text>
              <View style={styles.entryInfo}>
                <Text style={styles.entryTitle} numberOfLines={1}>{item.display_title}</Text>
                <View style={styles.entryMeta}>
                  <Text style={styles.entryDate}>{formatDate(item.date_added)}</Text>
                  <Text style={styles.entryDot}>·</Text>
                  <Text style={styles.entryChars}>{item.word_count} chars</Text>
                </View>
              </View>
            </View>
            {item.favorited ? (
              <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
            ) : (
              <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
            )}
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
              <MaterialCommunityIcons name="text-box-outline" size={36} color="#C7D2FE" />
            </View>
            <Text style={styles.emptyTitle}>No entries yet</Text>
            <Text style={styles.emptySubtext}>Tap + to write your first entry</Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      {/* FAB */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => router.push(`/entry/new?topicId=${id}`)}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </Pressable>
    </View>
  );
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: { flex: 1 },
  title: { fontSize: 20, fontWeight: '700', color: '#0F172A', lineHeight: 26 },
  subtitle: { fontSize: 13, color: '#94A3B8', marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 6, marginLeft: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: { backgroundColor: '#FEF2F2' },
  list: { paddingHorizontal: 20 },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  pressed: { opacity: 0.6, transform: [{ scale: 0.98 }] },
  entryLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  entryNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#CBD5E1',
    marginRight: 14,
    width: 22,
  },
  entryInfo: { flex: 1 },
  entryTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  entryMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  entryDate: { fontSize: 12, color: '#94A3B8' },
  entryDot: { fontSize: 12, color: '#CBD5E1', marginHorizontal: 6 },
  entryChars: { fontSize: 12, color: '#94A3B8' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  fabPressed: { transform: [{ scale: 0.92 }] },
  empty: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  emptySubtext: { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 18 },
});
