import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight, Radii, Spacing } from '@/constants/theme';

interface StatBadgeProps {
  icon: string;
  value: string | number;
  label: string;
  color?: string;
}

export default function StatBadge({ icon, value, label, color = Colors.neonCyan }: StatBadgeProps) {
  return (
    <View style={[styles.container, { borderColor: color + '40', backgroundColor: color + '15' }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    minWidth: 70,
    gap: 2,
  },
  icon: { fontSize: 20 },
  value: { fontSize: FontSize.lg, fontWeight: FontWeight.black },
  label: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.medium },
});
