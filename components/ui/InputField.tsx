// components/ui/InputField.tsx
import { useState } from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { View, Text, TextInput, Pressable, StyleSheet, TextInputProps } from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontFamily } from '../../constants/theme';

interface InputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  secureTextEntry?: boolean; // si es true, muestra el botón "Ver / Ocultar"
  multiline?: boolean;
}

export function InputField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  keyboardType = 'default',
  autoCapitalize,
  secureTextEntry,
  multiline,
}: InputFieldProps<T>) {
  const [oculto, setOculto] = useState(true);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.wrapper}>
          <Text style={styles.label}>{label.toUpperCase()}</Text>

          <View style={[styles.inputRow, error && styles.inputError]}>
            <TextInput
              value={value !== undefined && value !== null ? String(value) : ''}
              onChangeText={onChange}
              onBlur={onBlur} // vital para validar en modo 'onTouched'
              placeholder={placeholder}
              placeholderTextColor={Colors.textMuted}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              secureTextEntry={secureTextEntry ? oculto : false}
              multiline={multiline}
              style={[styles.input, multiline && styles.textArea]}
            />
            {secureTextEntry && (
              <Pressable onPress={() => setOculto((v) => !v)} hitSlop={8}>
                <Text style={styles.toggle}>{oculto ? 'Ver' : 'Ocultar'}</Text>
              </Pressable>
            )}
          </View>

          {error && <Text style={styles.errorTxt}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.md },
  label: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.sm + 4,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.text,
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  toggle: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.secondary },
  inputError: { borderColor: Colors.danger },
  errorTxt: {
    color: Colors.danger,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    marginTop: Spacing.xs,
  },
});
