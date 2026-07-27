import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, Card, ActivityIndicator, FAB, IconButton } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { topics, entries } from '../../lib/api';

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams();
  const [topic, setTopic] = useState(null);
  const [entryList, setEntryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, [id]);

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

  if (loading) return <ActivityIndicator style={styles.loading} size="large" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>{topic?.text}</Text>
        <View style={styles.actions}>
          <IconButton icon="pencil" size={20} onPress={() => {}} />
          <IconButton icon="delete" size={20} iconColor="#ef4444" onPress={handleDelete} />
        </View>
      </View>

      <FlatList
        data={entryList}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => router.push(`/entry/${item.id}`)}>
            <Card.Content>
              <View style={styles.entryRow}>
                <Text variant="titleSmall" numberOfLines={1} style={styles.entryTitle}>
                  {item.display_title}
                </Text>
                {item.favorited && <Text style={styles.star}>★</Text>}
              </View>
              <Text variant="bodySmall" style={styles.meta}>
                {new Date(item.date_added).toLocaleDateString()} · {item.word_count} chars
              </Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No entries yet. Write your first one!</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push(`/entry/new?topicId=${id}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loading: { flex: 1, justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontWeight: 'bold', flex: 1 },
  actions: { flexDirection: 'row' },
  card: { marginHorizontal: 16, marginBottom: 10, elevation: 1 },
  entryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  entryTitle: { flex: 1 },
  star: { color: '#f59e0b', fontSize: 18, marginLeft: 8 },
  meta: { color: '#666', marginTop: 2 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#6366f1' },
  empty: { alignItems: 'center', marginTop: 48 },
  emptyText: { color: '#666' },
});
