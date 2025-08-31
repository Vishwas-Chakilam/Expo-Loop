import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { Clock, Check } from 'lucide-react-native';
import { getThemeColors } from '@/utils/theme';

interface TimePickerModalProps {
  visible: boolean;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  onClose: () => void;
}

export function TimePickerModal({ visible, selectedTime, onTimeSelect, onClose }: TimePickerModalProps) {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  
  const [tempHour, setTempHour] = useState(() => {
    const [hour] = selectedTime.split(':');
    return parseInt(hour);
  });
  const [tempMinute, setTempMinute] = useState(() => {
    const [, minute] = selectedTime.split(':');
    return parseInt(minute);
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleConfirm = () => {
    const timeString = `${String(tempHour).padStart(2, '0')}:${String(tempMinute).padStart(2, '0')}`;
    onTimeSelect(timeString);
  };

  const styles = getStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Clock size={24} color={colors.primary} strokeWidth={2} />
            <Text style={styles.title}>Set Reminder Time</Text>
          </View>

          <View style={styles.pickerContainer}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Hour</Text>
              <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                {hours.map(hour => (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.pickerItem,
                      tempHour === hour && styles.selectedPickerItem
                    ]}
                    onPress={() => setTempHour(hour)}
                  >
                    <Text style={[
                      styles.pickerText,
                      tempHour === hour && styles.selectedPickerText
                    ]}>
                      {String(hour).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.separator}>:</Text>

            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Minute</Text>
              <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                {minutes.filter(m => m % 5 === 0).map(minute => (
                  <TouchableOpacity
                    key={minute}
                    style={[
                      styles.pickerItem,
                      tempMinute === minute && styles.selectedPickerItem
                    ]}
                    onPress={() => setTempMinute(minute)}
                  >
                    <Text style={[
                      styles.pickerText,
                      tempMinute === minute && styles.selectedPickerText
                    ]}>
                      {String(minute).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Check size={20} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  picker: {
    height: 150,
    width: '100%',
  },
  pickerItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
    alignItems: 'center',
  },
  selectedPickerItem: {
    backgroundColor: colors.primary,
  },
  pickerText: {
    fontSize: 18,
    color: colors.text,
  },
  selectedPickerText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  separator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: 16,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
    gap: 6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});