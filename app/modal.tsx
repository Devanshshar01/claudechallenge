import { MoodIndicator } from '@/components/MoodIndicator';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { saveEntry } from '@/utils/storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ModalScreen() {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<'happy' | 'calm' | 'neutral' | 'sad' | 'anxious'>('neutral');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const handleSave = async () => {
    if (!content.trim()) return;

    await saveEntry({
      content,
      mood,
      tags: [],
    });
    router.back();
  };

  const moods: Array<'happy' | 'calm' | 'neutral' | 'sad' | 'anxious'> = ['happy', 'calm', 'neutral', 'sad', 'anxious'];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.cancelButton, { color: theme.subtext }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>New Entry</Text>
        <TouchableOpacity onPress={handleSave} disabled={!content.trim()}>
          <Text style={[styles.saveButton, { color: content.trim() ? theme.primary : theme.subtext }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.label, { color: theme.text }]}>How are you feeling?</Text>
        <View style={styles.moodContainer}>
          {moods.map((m) => (
            <TouchableOpacity
              key={m}
              style={[
                styles.moodButton,
                mood === m && { backgroundColor: theme.card, borderColor: theme.primary, borderWidth: 2 }
              ]}
              onPress={() => setMood(m)}
            >
              <MoodIndicator mood={m} size={32} />
              <Text style={[styles.moodText, { color: theme.subtext }]}>{m.charAt(0).toUpperCase() + m.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.text, marginTop: 24 }]}>What's on your mind?</Text>
        <TextInput
          style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border }]}
          multiline
          placeholder="Write your thoughts here..."
          placeholderTextColor={theme.subtext}
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    fontSize: 16,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  moodButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    gap: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodText: {
    fontSize: 10,
  },
  input: {
    height: 300,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
});
