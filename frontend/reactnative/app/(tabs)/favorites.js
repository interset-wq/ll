import { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { entries } from '../../lib/api';

export default function FavoritesScreen() {
  const [favEntries, setFavEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadData = useCallback(async () => {
    try {
      const res = await entries.list({ favorited: true });
      setFavEntries(res.data.results);
    } catch {} finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, []);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  const renderItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/entry/${item.id}`)}
    >
      <View style={styles.cardIcon}>
        <MaterialCommunityIcons name="star" size={18} color="#F59E0B" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.display_title}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.topicName}>{item.topic_text}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.date}>{formatDate(item.date_added)}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <FlatList
          data={favEntries}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
          ListHeaderComponent={
            <Text style={styles.pageTitle}>Favorites</Text>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyIconWrap}>
                <MaterialCommunityIcons name="star-outline" size={40} color="#FDE68A" />
              </View>
              <Text style={styles.emptyTitle}>No favorites yet</Text>
              <Text style={styles.emptySubtext}>Star entries you love and they'll show up here</Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: 24 }} />}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingTop: 8, paddingHorizontal: 20 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  topicName: { fontSize: 12, color: '#6366f1', fontWeight: '500' },
  dot: { fontSize: 12, color: '#CBD5E1', marginHorizontal: 6 },
  date: { fontSize: 12, color: '#94A3B8' },
  empty: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  emptySubtext: { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 18 },
});
