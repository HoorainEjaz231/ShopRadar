import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { customersApi } from '../lib/api';
import { colors, radius, spacing, typography } from '../theme';
import { Button, ModalAlert } from '../components/ui';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', onConfirm: null });

  const handleLoginCheck = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const customer = await customersApi.getCustomerByAuthUser();
      if (customer) {
        await AsyncStorage.setItem('user', JSON.stringify(customer));
        navigation.replace('DrawerNav');
      }
    }
  };

  useEffect(() => {
    handleLoginCheck();
  }, []);

  const closeAlert = () => setAlert((a) => ({ ...a, visible: false }));

  const handleLogin = async () => {
    setSubmitting(true);
    try {
      const { customer } = await customersApi.signIn({ Email: email, Password: password });
      await AsyncStorage.setItem('user', JSON.stringify(customer));
      setAlert({
        visible: true,
        title: 'Welcome back',
        message: 'Logged in successfully.',
        onConfirm: () => {
          closeAlert();
          navigation.replace('DrawerNav');
        },
      });
    } catch (error) {
      setAlert({
        visible: true,
        title: 'Login failed',
        message: 'Please check your credentials and try again.',
        onConfirm: closeAlert,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={[typography.display, styles.header]}>Login</Text>

        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Email"
          placeholderTextColor={colors.textGray}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[typography.body, styles.input]}
          placeholder="Password"
          placeholderTextColor={colors.textGray}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title="Login" onPress={handleLogin} loading={submitting} style={styles.submit} />

        <View style={styles.footer}>
          <Text style={typography.bodySm}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={[typography.bodySm, styles.link]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={typography.bodySm}>Show Products Only </Text>
          <TouchableOpacity onPress={() => navigation.navigate('DrawerNav')}>
            <Text style={[typography.bodySm, styles.link]}>View Products</Text>
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
