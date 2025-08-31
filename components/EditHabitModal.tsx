import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  useColorScheme,
  ScrollView,
  Animated,
} from 'react-native';
import { X, Save } from 'lucide-react-native';
import { ColorPicker } from './ColorPicker';
import { IconPicker } from './IconPicker';
import { FrequencySelector } from './FrequencySelector';
import { TimePickerModal } from './TimePickerModal';
import { getThemeColors } from '@/utils/theme';
import type { Habit } from '@/types/habit';

interface EditHabitModalProps {
  visible: boolean;
  habit: Habit | null;
  onClose: () => void;
  onSave: (habitId: string, updates: Partial<Habit>) => void;
}

export function EditHabitModal({ visible, habit, onClose, onSave }: EditHabitModalProps) {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors.primary);
  const [selectedIcon, setSelectedIcon] = useState('target');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible && habit) {
      setTitle(habit.title);
      setDescription(habit.description);
      setSelectedColor(habit.color);
      setSelectedIcon(habit.icon);
      setFrequency(habit.frequency);
      setReminderTime(habit.reminderTime);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, habit]);

  const handleSave = async () => {
    if (!habit || !title.trim()) return;

    setIsLoading(true);
    try {
      await onSave(habit.id, {
        title: title.trim(),
        description: description.trim(),
        color: selectedColor,
        icon: selectedIcon,
        frequency,
        reminderTime,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update habit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeSelect = (time: string) => {
    setReminderTime(time);
    setShowTimePicker(false);
  };

  const styles = getStyles(colors);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Habit</Text>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            disabled={isLoading || !title.trim()}
          >
            <Save size={20} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Habit Name *</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g., Drink 8 glasses of water"
                  placeholderTextColor={colors.textSecondary}
                  maxLength={50}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description (optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add some details about your habit..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customization</Text>
              
              <ColorPicker
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
              
              <IconPicker
                selectedIcon={selectedIcon}
                onIconSelect={setSelectedIcon}
                color={selectedColor}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Schedule</Text>
              
              <FrequencySelector
                frequency={frequency}
                onFrequencyChange={setFrequency}
              />

              <View style={styles.reminderContainer}>
                <Text style={styles.reminderLabel}>Reminder Time</Text>
                <TouchableOpacity 
                  style={styles.timeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.timeText}>{reminderTime}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </Animated.View>

        <TimePickerModal
          visible={showTimePicker}
          selectedTime={reminderTime}
          onTimeSelect={handleTimeSelect}
          onClose={() => setShowTimePicker(false)}
        />
      </View>
    </Modal>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  reminderContainer: {
    marginTop: 16,
  },
  reminderLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  timeButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  timeText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
});