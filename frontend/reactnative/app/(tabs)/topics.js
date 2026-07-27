import { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, FAB, ActivityIndicator, Dialog, TextInput, Button, Portal } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { topics } from '../../lib/api';

export default function TopicsScreen() {
  const [topicList, setTopicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const loadTopics = useCallback(async () => {
    try {
      const res = await topics.list();
      setTopicList(res.data.results);
    } catch {} finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadTopics(); }, []);

  const onRefresh = () => { setRefreshing(true); loadTopics(); };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await topics.create(newTitle.trim());
      setTopicList([res.data, ...topicList]);
      setShowNew(false);
      setNewTitle('');
    } catch {} finally {
      setCreating(false);
    }
  };

  const renderTopic = ({ item }) => (
    <Card style={styles.card} onPress={() => router.push(`/topic/${item.id}`)}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <Text variant="titleMedium" numberOfLines={1}>{item.text}</Text>
          <Text variant="bodySmall" style={styles.meta}>
            {item.entry_count} entries · {new Date(item.date_added).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" />
      ) : (
        <FlatList
          data={topicList}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderTopic}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No topics yet. Create one!</Text>
            </View>
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowNew(true)}
      />

      <Portal>
        <Dialog visible={showNew} onDismiss={() => setShowNew(false)}>
          <Dialog.Title>New Topic</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Topic name"
              value={newTitle}
              onChangeText={setNewTitle}
              mode="outlined"
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowNew(false)}>Cancel</Button>
            <Button onPress={handleCreate} loading={creating} disabled={!newTitle.trim()}>
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  arrow: { fontSize: 24, color: '#999', marginLeft: 8 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#6366f1' },
  empty: { alignItems: 'center', marginTop: 48 },
  emptyText: { color: '#666' },
});
