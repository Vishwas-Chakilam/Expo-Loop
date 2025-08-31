import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { getThemeColors, HABIT_COLORS } from '@/utils/theme';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export function ColorPicker({ selectedColor, onColorSelect }: ColorPickerProps) {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Choose Color</Text>
      <View style={styles.colorRow}>
        {HABIT_COLORS.map(color => {
          const isSelected = selectedColor === color;
          
          return (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                isSelected && styles.selectedColor
              ]}
              onPress={() => onColorSelect(color)}
            >
              {isSelected && (
                <View style={styles.checkmark} />
              )}
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
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
});