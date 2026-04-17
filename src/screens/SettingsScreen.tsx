import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CATEGORIES, Category } from '../data/meals';
import { AppSettings } from '../hooks/useSettings';
import { colors, radii, spacing, typography } from '../theme';
import AppButton from '../components/ui/AppButton';

const CATEGORY_OPTIONS = Object.values(CATEGORIES) as Category[];

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  appVersion: string;
}

export default function SettingsScreen({ settings, onUpdateSettings, appVersion }: SettingsScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Personalise your experience</Text>
        </View>

        {/* Preferences section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>Budget mode default</Text>
                <Text style={styles.rowHint}>When on, the app always starts in budget mode.</Text>
              </View>
              <Switch
                value={settings.isBrokeModeDefault}
                onValueChange={(value) => onUpdateSettings({ isBrokeModeDefault: value })}
                trackColor={{ false: colors.border, true: colors.ctaBackground }}
                thumbColor={colors.surface}
                accessibilityLabel="Budget mode default"
                accessibilityRole="switch"
                accessibilityState={{ checked: settings.isBrokeModeDefault }}
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.rowLabel}>Default category</Text>
            <Text style={styles.rowHint}>The category filter that loads when you open the app.</Text>
            <View style={styles.categoryRow}>
              {CATEGORY_OPTIONS.map((cat) => (
                <AppButton
                  key={cat}
                  label={cat}
                  variant={settings.defaultCategory === cat ? 'primary' : 'secondary'}
                  onPress={() => onUpdateSettings({ defaultCategory: cat })}
                  style={styles.categoryBtn}
                  accessibilityLabel={`Set default category to ${cat}`}
                />
              ))}
            </View>
          </View>
        </View>

        {/* About section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutEmoji}>🍽️</Text>
              <View>
                <Text style={styles.aboutName}>hungr</Text>
                <Text style={styles.aboutTagline}>Decide your next meal in seconds</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.versionText}>Version {appVersion}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.md,
    paddingBottom: spacing['4xl'],
    gap: spacing.xl,
  },
  header: {
    gap: spacing.xxs,
    paddingBottom: spacing.xs,
  },
  title: {
    ...typography.scale.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.scale.body,
    color: colors.textSecondary,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.scale.caption,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowText: {
    flex: 1,
    gap: spacing.xxs,
  },
  rowLabel: {
    ...typography.scale.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  rowHint: {
    ...typography.scale.body,
    color: colors.textSecondary,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  categoryBtn: {
    flexShrink: 1,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  aboutEmoji: {
    fontSize: 40,
  },
  aboutName: {
    ...typography.scale.h2,
    color: colors.ctaBackground,
  },
  aboutTagline: {
    ...typography.scale.body,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  versionText: {
    ...typography.scale.body,
    color: colors.textMuted,
  },
});
