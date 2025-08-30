import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Calendar, Clock, Settings } from 'lucide-react-native';
import { getThemeColors } from '@/utils/theme';

interface FrequencySelectorProps {
  frequency: 'daily' | 'weekly' | 'custom';
  onFrequencyChange: (frequency: 'daily' | 'weekly' | 'custom') => void;
}

export function FrequencySelector({ frequency, onFrequencyChange }: FrequencySelectorProps) {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  
  const options = [
    { key: 'daily', label: 'Daily', icon: Calendar, description: 'Every day' },
    { key: 'weekly', label: 'Weekly', icon: Clock, description: 'Once per week' },
    { key: 'custom', label: 'Custom', icon: Settings, description: 'Custom schedule' },
  ] as const;
  
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Frequency</Text>
      <View style={styles.optionsContainer}>
        {options.map(option => {
          const isSelected = frequency === option.key;
          const IconComponent = option.icon;
          
          return (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.option,
                isSelected && styles.selectedOption
              ]}
              onPress={() => onFrequencyChange(option.key)}
            >
              <View style={styles.optionContent}>
                <IconComponent 
                  size={18} 
                  color={isSelected ? colors.primary : colors.textSecondary}
                  strokeWidth={2} 
                />
                <View style={styles.optionText}>
                  <Text style={[
                    styles.optionLabel,
                    isSelected && styles.selectedOptionLabel
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 8,
  },
  option: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.background,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 12,
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  selectedOptionLabel: {
    color: colors.primary,
  },
  optionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});