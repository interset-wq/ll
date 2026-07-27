import { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { Text, ActivityIndicator, Portal, Modal, TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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

  const renderTopic = ({ item, index }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/topic/${item.id}`)}
    >
      <View style={styles.cardLeft}>
        <View style={[styles.numberBadge, { backgroundColor: getAccentColor(index) }]}>
          <Text style={styles.numberText}>{String(index + 1).padStart(2, '0')}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.text}</Text>
          <Text style={styles.cardMeta}>
            {item.entry_count} {item.entry_count === 1 ? 'entry' : 'entries'}
          </Text>
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
          data={topicList}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderTopic}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
          ListHeaderComponent={
            <Text style={styles.pageTitle}>All Topics</Text>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyIconWrap}>
                <MaterialCommunityIcons name="book-open-page-variant" size={40} color="#C7D2FE" />
              </View>
              <Text style={styles.emptyTitle}>No topics yet</Text>
              <Text style={styles.emptySubtext}>Tap the + button to create your first topic</Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => setShowNew(true)}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </Pressable>

      <Portal>
        <Modal
          visible={showNew}
          onDismiss={() => setShowNew(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>New Topic</Text>
          <Text style={styles.modalSubtitle}>What do you want to learn about?</Text>
          <TextInput
            value={newTitle}
            onChangeText={setNewTitle}
            mode="outlined"
            placeholder="e.g. Python, Design, History..."
            autoFocus
            outlineColor="#E2E8F0"
            activeOutlineColor="#6366f1"
            style={styles.input}
          />
          <View style={styles.modalActions}>
            <Button
              mode="text"
              onPress={() => { setShowNew(false); setNewTitle(''); }}
              textColor="#64748B"
              style={styles.cancelBtn}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleCreate}
              loading={creating}
              disabled={!newTitle.trim()}
              buttonColor="#6366f1"
              style={styles.createBtn}
            >
              Create
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

function getAccentColor(index) {
  const colors = ['#EEF2FF', '#FEF3C7', '#ECFDF5', '#FCE7F3', '#F0F9FF'];
  return colors[index % colors.length];
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingTop: 8, paddingHorizontal: 20 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  card: {
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
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: { fontSize: 13, fontWeight: '700', color: '#6366f1' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  cardMeta: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
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
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  emptySubtext: { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 18 },
  modal: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  modalSubtitle: { fontSize: 13, color: '#94A3B8', marginTop: 4, marginBottom: 16 },
  input: { backgroundColor: '#F8FAFC' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 8 },
  cancelBtn: { borderRadius: 10 },
  createBtn: { borderRadius: 10 },
});
