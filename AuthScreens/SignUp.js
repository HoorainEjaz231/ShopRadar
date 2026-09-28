import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { customersApi } from '../lib/api';
import { colors, radius, spacing, typography } from '../theme';
import { Button, ModalAlert } from '../components/ui';

const FIELDS = [
  { key: 'fullName', placeholder: 'Full Name' },
  { key: 'email', placeholder: 'Email', keyboardType: 'email-address', autoCapitalize: 'none' },
  { key: 'phone', placeholder: 'Phone', keyboardType: 'phone-pad' },
  { key: 'address', placeholder: 'Address' },
  { key: 'city', placeholder: 'City' },
  { key: 'stateProvince', placeholder: 'State/Province' },
  { key: 'country', placeholder: 'Country' },
  { key: 'password', placeholder: 'Password', secureTextEntry: true },
];

export default function SignUp({ navigation }) {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', stateProvince: '', country: '', password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', onConfirm: null });

  const setField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const closeAlert = () => setAlert((a) => ({ ...a, visible: false }));

  const handleSignUp = async () => {
    setSubmitting(true);
    try {
      const { session } = await customersApi.signUp({
        FullName: form.fullName,
        Email: form.email,
        Phone: form.phone,
        Address: form.address,
        City: form.city,
        StateProvince: form.stateProvince,
        Country: form.country,
        Password: form.password,
      });
      setAlert({
        visible: true,
        title: 'Account created',
        message: session
          ? 'Your account was created successfully.'
          : 'Your account was created. Check your email to confirm it, then log in.',
        onConfirm: () => {
          closeAlert();
          navigation.replace('Login');
        },
      });
    } catch (error) {
      setAlert({
        visible: true,
        title: 'Sign up failed',
        message: error.message || 'Please try again.',
        onConfirm: closeAlert,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={[typography.display, styles.header]}>Sign Up</Text>

        {FIELDS.map((f) => (
          <TextInput
            key={f.key}
            style={[typography.body, styles.input]}
            placeholder={f.placeholder}
            placeholderTextColor={colors.textGray}
            value={form[f.key]}
            onChangeText={setField(f.key)}
            keyboardType={f.keyboardType}
            autoCapitalize={f.autoCapitalize}
            secureTextEntry={f.secureTextEntry}
          />
        ))}

        <Button title="Sign Up" onPress={handleSignUp} loading={submitting} style={styles.submit} />

        <View style={styles.footer}>
          <Text style={typography.bodySm}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[typography.bodySm, styles.link]}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ModalAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        confirmLabel="OK"
        onConfirm={alert.onConfirm}
        onRequestClose={closeAlert}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    padding: spacing.space5,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.space7,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  input: {
    height: spacing.touchTarget,
    borderColor: colors.white,
    borderWidth: 1,
    marginBottom: spacing.space3,
    paddingHorizontal: spacing.space5,
    borderRadius: radius.pill,
    backgroundColor: colors.backgroundFaf,
    color: colors.textPrimary,
  },
  submit: {
    marginTop: spacing.space3,
  },
  footer: {
    flexDirection: 'row',
    marginTop: spacing.space4,
    justifyContent: 'center',
  },
  link: {
    color: colors.primary,
    fontFamily: typography.chipSelected.fontFamily,
  },
});
