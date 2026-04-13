import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, componentSizes, radii, spacing, typography } from '../../theme';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  onClear?: () => void;
}

export default function InputField({ label, value, onChangeText, placeholder, error, onClear }: InputFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error && styles.inputRowError]}>
        <TextInput
          accessibilityLabel={label}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {value.length > 0 && onClear ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={onClear} hitSlop={12}>
            <Text style={styles.clear}>Clear</Text>
          </Pressable>
        ) : null}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.scale.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  inputRow: {
    minHeight: componentSizes.inputHeight,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inputRowError: {
    borderColor: colors.errorText,
  },
  input: {
    flex: 1,
    ...typography.scale.bodyLarge,
    color: colors.textPrimary,
  },
  clear: {
    ...typography.scale.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  error: {
    ...typography.scale.caption,
    color: colors.errorText,
  },
});
