import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { entries, topics } from '../../lib/api';

export default function NewEntryScreen() {
  const { topicId } = useLocalSearchParams();
  const [topic, setTopic] = useState(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (topicId) {
      topics.get(Number(topicId)).then((res) => {
        setTopic(res.data);
        setFetching(false);
      }).catch(() => setFetching(false));
    }
  }, [topicId]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await entries.create({
        title: title.trim() || 'Untitled',
        text: text.trim(),
        topic_id: Number(topicId),
      });
      router.replace(`/entry/${res.data.id}`);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.text?.[0] || data?.title?.[0] || 'Failed to create entry');
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons name="book-open-page-variant" size={32} color="#C7D2FE" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Topic badge */}
        <View style={styles.topicBadge}>
          <MaterialCommunityIcons name="book-open-variant" size={14} color="#6366f1" />
          <Text style={styles.topicBadgeText} numberOfLines={1}>{topic?.text || 'Topic'}</Text>
        </View>

        <Text style={styles.pageTitle}>New Entry</Text>

        {error ? (
          <View style={styles.errorBox}>
            <MaterialCommunityIcons name="alert-circle" size={16} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TextInput
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          placeholder="Title (optional)"
          maxLength={200}
          outlineColor="#E2E8F0"
          activeOutlineColor="#6366f1"
          style={styles.input}
        />

        <TextInput
          value={text}
          onChangeText={setText}
          mode="outlined"
          placeholder="Write your thoughts here... (supports Markdown)"
          multiline
          numberOfLines={12}
          outlineColor="#E2E8F0"
          activeOutlineColor="#6366f1"
          style={styles.textArea}
        />

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading || !text.trim()}
            buttonColor="#6366f1"
            style={styles.submitBtn}
            contentStyle={{ height: 48 }}
          >
            Save Entry
          </Button>
          <Button
            mode="text"
            onPress={() => router.back()}
            textColor="#64748B"
            style={styles.cancelBtn}
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  content: { padding: 20 },
  topicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
    marginBottom: 12,
  },
  topicBadgeText: { fontSize: 12, fontWeight: '600', color: '#6366f1', maxWidth: 200 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: { fontSize: 13, color: '#EF4444', flex: 1 },
  input: { backgroundColor: '#fff', marginBottom: 12 },
  textArea: {
    backgroundColor: '#fff',
    marginBottom: 20,
    minHeight: 200,
  },
  actions: { gap: 10 },
  submitBtn: { borderRadius: 12 },
  cancelBtn: { borderRadius: 12 },
});
