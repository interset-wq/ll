import { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
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
    <Card style={styles.card} onPress={() => router.push(`/entry/${item.id}`)}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <Text variant="titleSmall" numberOfLines={1}>{item.display_title}</Text>
          <Text variant="bodySmall" style={styles.meta}>
            {item.topic_text} · {new Date(item.date_added).toLocaleDateString()}
          </Text>
        </View>
        <MaterialCommunityIcons name="star" size={20} color="#f59e0b" />
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" />
      ) : (
        <FlatList
          data={favEntries}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="star-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No favorited entries yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loading: { flex: 1, justifyContent: 'center' },
  list: { padding: 16 },
  card: { marginBottom: 10, elevation: 1 },
  cardContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flex: 1 },
  meta: { color: '#666', marginTop: 2 },
  empty: { alignItems: 'center', marginTop: 48 },
  emptyText: { color: '#666', marginTop: 8 },
});
