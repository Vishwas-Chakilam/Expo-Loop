import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Animated,
  Alert,
} from 'react-native';
import { CircleCheck as CheckCircle2, Circle, Target, Heart, Zap, Book, Coffee, Dumbbell, Moon, Sun, Droplets, Leaf, Star, Flame, MoveVertical as MoreVertical, CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { getThemeColors } from '@/utils/theme';
import type { Habit } from '@/types/habit';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
  onEdit?: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
}

const iconMap = {
  target: Target,
  heart: Heart,
  zap: Zap,
  book: Book,
  coffee: Coffee,
  dumbbell: Dumbbell,
  moon: Moon,
  sun: Sun,
  droplets: Droplets,
  leaf: Leaf,
  star: Star,
  flame: Flame,
};

export function HabitCard({ habit, onToggle, onEdit, onDelete }: HabitCardProps) {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [checkAnim] = useState(new Animated.Value(1));
  const [showActions, setShowActions] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const isCompleted = habit.completions.some((c) => c.date === today);

  const IconComponent = iconMap[habit.icon as keyof typeof iconMap] || Target;

  const handleToggle = () => {
    // Card press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Check button animation
    Animated.sequence([
      Animated.timing(checkAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(checkAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle(habit.id);
  };

  const handleEdit = () => {
    setShowActions(false);
    onEdit?.(habit);
  };

  const handleDelete = () => {
    setShowActions(false);
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.title}"? This will also remove all completion history.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete?.(habit.id),
        },
      ]
    );
  };

  const styles = getStyles(colors, habit.color, isCompleted);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <IconComponent size={20} color={habit.color} strokeWidth={2} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{habit.title}</Text>
          {habit.description ? (
            <Text style={styles.description}>{habit.description}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowActions(!showActions)}
        >
          <MoreVertical size={20} color={colors.textSecondary} strokeWidth={2} />
        </TouchableOpacity>

        <Animated.View style={{ transform: [{ scale: checkAnim }] }}>
          <TouchableOpacity
            style={styles.checkButton}
            onPress={handleToggle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isCompleted ? (
              <CheckCircle2 size={28} color={habit.color} strokeWidth={2} />
            ) : (
              <Circle size={28} color={colors.textSecondary} strokeWidth={2} />
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

      {showActions && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Edit size={16} color={colors.primary} strokeWidth={2} />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Trash2 size={16} color="#FF3B30" strokeWidth={2} />
            <Text style={[styles.actionText, { color: '#FF3B30' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const getStyles = (colors: any, habitColor: string, isCompleted: boolean) =>
  StyleSheet.create({
    container: {
      marginBottom: 12,
      borderRadius: 16,
      backgroundColor: colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: `${habitColor}20`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
      paddingRight: 12,
    },
    menuButton: {
      padding: 8,
      marginRight: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      lineHeight: 20,
      textDecorationLine: isCompleted ? 'line-through' : 'none',
      opacity: isCompleted ? 0.7 : 1,
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
      lineHeight: 18,
    },
    checkButton: {
      padding: 4,
    },
    actionsContainer: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
      paddingHorizontal: 16,
      paddingBottom: 4,
      gap: 16,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: colors.background,
      gap: 6,
    },
    actionText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
    },
  });
