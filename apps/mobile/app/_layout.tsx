import { Stack } from 'expo-router';
import '@/i18n/config'; // Initialize i18n

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Dingo - Lawyers' }} />
    </Stack>
  );
}
