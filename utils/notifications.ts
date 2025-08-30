import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions() {
  if (Platform.OS === 'web') {
    return { granted: false };
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return { granted: finalStatus === 'granted' };
  } catch (error) {
    console.error('Failed to request permissions:', error);
    return { granted: false };
  }
}

export async function scheduleHabitReminder(
  habitId: string,
  habitTitle: string,
  reminderTime: string
) {
  if (Platform.OS === 'web') {
    return null;
  }

  try {
    // Cancel existing notification for this habit
    await cancelHabitReminder(habitId);

    // Parse reminder time (format: "HH:MM")
    const [hours, minutes] = reminderTime.split(':').map(Number);
    
    // Calculate 15 minutes before
    let reminderHour = hours;
    let reminderMinute = minutes - 15;
    
    if (reminderMinute < 0) {
      reminderMinute += 60;
      reminderHour -= 1;
    }
    
    if (reminderHour < 0) {
      reminderHour += 24;
    }
    
    // Schedule daily notification 15 minutes before habit time
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 Habit Reminder',
        body: `Time to complete: ${habitTitle} (in 15 minutes)`,
        data: { habitId },
        sound: true,
      },
      trigger: {
        hour: reminderHour,
        minute: reminderMinute,
        repeats: true,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return null;
  }
}

export async function cancelHabitReminder(habitId: string) {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduledNotifications) {
      if (notification.content.data?.habitId === habitId) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  } catch (error) {
    console.error('Failed to cancel notification:', error);
  }
}

export async function cancelAllNotifications() {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Failed to cancel all notifications:', error);
  }
}