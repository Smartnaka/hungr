import React from 'react';
import AppButton from './ui/AppButton';

interface SuggestButtonProps {
  onPress: () => void;
  isBroke: boolean;
  loading?: boolean;
}

export default function SuggestButton({ onPress, isBroke, loading }: SuggestButtonProps) {
  return <AppButton label={isBroke ? 'Suggest budget meal' : 'Suggest meal'} onPress={onPress} loading={loading} />;
}
