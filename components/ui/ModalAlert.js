import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography, shadows } from '../../theme';
import Button from './Button';

// The one confirm/error/info dialog shape in this system — used for every
// user-facing dialog, never the platform-native Alert.alert, which can't be
// themed to match. State plainly what will happen; let the button labels
// carry the actual verbs ("Delete", not "OK").
export default function ModalAlert({
  visible,
  title,
  message,
  confirmLabel = 'OK',
  onConfirm,
  cancelLabel,
  onCancel,
  onRequestClose,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose ?? onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {title ? <Text style={[typography.headerTitle, styles.title]}>{title}</Text> : null}
          {message ? <Text style={[typography.bodySm, styles.message]}>{message}</Text> : null}

          <View style={styles.actions}>
            {cancelLabel ? (
              <Button variant="secondary" title={cancelLabel} onPress={onCancel} style={styles.actionButton} />
            ) : null}
            <Button variant="primary" title={confirmLabel} onPress={onConfirm} style={styles.actionButton} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.space5,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
    padding: spacing.space6,
    ...shadows.modal,
  },
  title: {
    color: colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    color: colors.textGray,
    textAlign: 'center',
    marginTop: spacing.space3,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.space3,
    marginTop: spacing.space6,
  },
  actionButton: {
    flex: 1,
  },
});
