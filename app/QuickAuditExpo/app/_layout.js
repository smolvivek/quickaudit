import { Stack } from 'expo-router';
import { ThemeProvider } from '../../context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'QuickAudit' }} />
      </Stack>
    </ThemeProvider>
  );
}
