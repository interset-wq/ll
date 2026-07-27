import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Pressable } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { entries } from '../../lib/api';

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => { loadEntry(); }, [id]);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#94A3B8' }}>Entry not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title section */}
        <Text style={styles.title}>{entry.display_title}</Text>

        {/* Meta row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="clock-outline" size={14} color="#94A3B8" />
            <Text style={styles.metaText}>{formatDateTime(entry.date_added)}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="text" size={14} color="#94A3B8" />
            <Text style={styles.metaText}>{entry.word_count} chars</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentCard}>
          <MarkdownContent text={entry.text} />
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <View style={styles.actionRow}>
            <Pressable
              style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
              onPress={handleFavorite}
            >
              <LinearGradient
                colors={entry.favorited ? ['#F59E0B', '#FBBF24'] : ['#F1F5F9', '#F1F5F9']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialCommunityIcons
                  name={entry.favorited ? 'star' : 'star-outline'}
                  size={18}
                  color={entry.favorited ? '#fff' : '#64748B'}
                />
                <Text style={[styles.actionText, entry.favorited && styles.actionTextLight]}>
                  {entry.favorited ? 'Favorited' : 'Favorite'}
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
              onPress={handleDuplicate}
            >
              <View style={styles.actionBtnOutline}>
                <MaterialCommunityIcons name="content-copy" size={18} color="#6366f1" />
                <Text style={[styles.actionText, { color: '#6366f1' }]}>Duplicate</Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
              onPress={() => {}}
            >
              <View style={styles.actionBtnOutline}>
                <MaterialCommunityIcons name="pencil-outline" size={18} color="#64748B" />
                <Text style={styles.actionText}>Edit</Text>
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
              onPress={handleDelete}
            >
              <View style={[styles.actionBtnOutline, styles.deleteOutline]}>
                <MaterialCommunityIcons name="delete-outline" size={18} color="#EF4444" />
                <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function MarkdownContent({ text }) {
  if (!text) return null;
  const lines = text.split('\n');

  return (
    <View>
      {lines.map((line, i) => {
        if (line.startsWith('# ')) {
          return <Text key={i} style={styles.mdH1}>{line.slice(2)}</Text>;
        }
        if (line.startsWith('## ')) {
          return <Text key={i} style={styles.mdH2}>{line.slice(3)}</Text>;
        }
        if (line.startsWith('### ')) {
          return <Text key={i} style={styles.mdH3}>{line.slice(4)}</Text>;
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <View key={i} style={styles.mdBullet}>
              <Text style={styles.mdBulletDot}>•</Text>
              <Text style={styles.mdBulletText}>{line.slice(2)}</Text>
            </View>
          );
        }
        if (line.startsWith('> ')) {
          return (
            <View key={i} style={styles.mdQuote}>
              <Text style={styles.mdQuoteText}>{line.slice(2)}</Text>
            </View>
          );
        }
        if (line.trim() === '') {
          return <View key={i} style={{ height: 10 }} />;
        }
        return <Text key={i} style={styles.mdParagraph}>{line}</Text>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A', lineHeight: 32, letterSpacing: -0.3 },
  metaRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
    gap: 16,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 13, color: '#94A3B8' },
  contentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  mdH1: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginTop: 12, marginBottom: 6 },
  mdH2: { fontSize: 17, fontWeight: '700', color: '#1E293B', marginTop: 10, marginBottom: 4 },
  mdH3: { fontSize: 15, fontWeight: '600', color: '#334155', marginTop: 8, marginBottom: 4 },
  mdBullet: { flexDirection: 'row', marginTop: 4 },
  mdBulletDot: { color: '#6366f1', marginRight: 8, fontWeight: '700' },
  mdBulletText: { flex: 1, fontSize: 15, color: '#334155', lineHeight: 22 },
  mdQuote: {
    borderLeftWidth: 3,
    borderLeftColor: '#C7D2FE',
    paddingLeft: 12,
    marginTop: 6,
    marginBottom: 2,
  },
  mdQuoteText: { fontSize: 14, color: '#64748B', fontStyle: 'italic', lineHeight: 20 },
  mdParagraph: { fontSize: 15, color: '#334155', lineHeight: 23, marginTop: 3 },
  actions: { gap: 10 },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1 },
  pressed: { opacity: 0.7, transform: [{ scale: 0.97 }] },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 13,
    gap: 6,
  },
  actionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 13,
    gap: 6,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  deleteOutline: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  actionText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  actionTextLight: { color: '#fff' },
});
