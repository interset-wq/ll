import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { entries } from '../../lib/api';

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadEntry();
  }, [id]);

  const loadEntry = async () => {
    try {
      const res = await entries.get(Number(id));
      setEntry(res.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    const res = await entries.favorite(entry.id);
    setEntry({ ...entry, favorited: res.data.favorited });
  };

  const handleDuplicate = async () => {
    const res = await entries.duplicate(entry.id);
    router.push(`/entry/${res.data.id}`);
  };

  const handleDelete = () => {
    Alert.alert('Delete Entry', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await entries.delete(entry.id);
          router.back();
        },
      },
    ]);
  };

  if (loading) return <ActivityIndicator style={styles.loading} size="large" />;
  if (!entry) return <View style={styles.loading}><Text>Entry not found</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>{entry.display_title}</Text>

      <View style={styles.meta}>
        <Text variant="bodySmall" style={styles.metaText}>
          {new Date(entry.date_added).toLocaleString()}
        </Text>
        <Text variant="bodySmall" style={styles.metaText}> · {entry.word_count} chars</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <MarkdownContent text={entry.text} />
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button mode="contained" onPress={() => {}} icon="pencil" style={styles.actionBtn}>
          Edit
        </Button>
        <Button mode="outlined" onPress={handleDuplicate} icon="content-copy" style={styles.actionBtn}>
          Duplicate
        </Button>
        <Button
          mode={entry.favorited ? 'contained' : 'outlined'}
          onPress={handleFavorite}
          icon="star"
          buttonColor={entry.favorited ? '#f59e0b' : undefined}
          textColor={entry.favorited ? '#fff' : '#f59e0b'}
          style={styles.actionBtn}
        >
          {entry.favorited ? 'Favorited' : 'Favorite'}
        </Button>
        <Button mode="outlined" onPress={handleDelete} icon="delete" textColor="#ef4444" style={styles.actionBtn}>
          Delete
        </Button>
      </View>
    </ScrollView>
  );
}

function MarkdownContent({ text }) {
  if (!text) return null;
  const lines = text.split('\n');

  return (
    <View>
      {lines.map((line, i) => {
        if (line.startsWith('# ')) {
          return <Text key={i} variant="titleLarge" style={{ fontWeight: 'bold', marginTop: 8 }}>{line.slice(2)}</Text>;
        }
        if (line.startsWith('## ')) {
          return <Text key={i} variant="titleMedium" style={{ fontWeight: '600', marginTop: 6 }}>{line.slice(3)}</Text>;
        }
        if (line.startsWith('- ')) {
          return (
            <View key={i} style={{ flexDirection: 'row', marginTop: 2 }}>
              <Text>• </Text>
              <Text style={{ flex: 1 }}>{line.slice(2)}</Text>
            </View>
          );
        }
        if (line.trim() === '') {
          return <View key={i} style={{ height: 8 }} />;
        }
        return <Text key={i} style={{ marginTop: 2, lineHeight: 22 }}>{line}</Text>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontWeight: 'bold', marginBottom: 4 },
  meta: { flexDirection: 'row', marginBottom: 16 },
  metaText: { color: '#666' },
  card: { marginBottom: 16, elevation: 1 },
  actions: { gap: 8 },
  actionBtn: { marginBottom: 0 },
});
