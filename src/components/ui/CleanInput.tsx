import React from 'react';
import { Input } from "@/components/ui/input";

export const cleanSpecialChars = (text: string): string => {
  return text
    .replace(/™/g, '') // Trademark
    .replace(/®/g, '') // Registered
    .replace(/©/g, '') // Copyright
    .replace(/℠/g, '') // Service mark
};

interface CleanInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
}

export const CleanInput: React.FC<CleanInputProps> = ({ 
  onValueChange,
  onChange,
  onPaste,
  ...props 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalValue = e.target.value;
    const cleanedValue = cleanSpecialChars(originalValue);
    
    // Si el valor necesita limpieza, actualizarlo
    if (cleanedValue !== originalValue) {
      // Modificar el valor del target directamente
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(e.target, cleanedValue);
      }
      
      // Crear y disparar un evento de input para que React lo detecte
      const inputEvent = new Event('input', { bubbles: true });
      e.target.dispatchEvent(inputEvent);
    }
    
    // Siempre llamar al onChange original
    onChange?.(e);
    
    // Llamar a onValueChange con el valor limpio
    onValueChange?.(cleanedValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    const cleanedText = cleanSpecialChars(pastedText);
    
    if (cleanedText !== pastedText) {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      
      // Obtener posición del cursor
      const start = target.selectionStart || 0;
      const end = target.selectionEnd || 0;
      const currentValue = target.value;
      
      // Calcular nuevo valor
      const newValue = currentValue.substring(0, start) + cleanedText + currentValue.substring(end);
      
      // Usar el setter nativo para actualizar el valor
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(target, newValue);
      }
      
      // Posicionar cursor
      const newCursorPosition = start + cleanedText.length;
      target.setSelectionRange(newCursorPosition, newCursorPosition);
      
      // Disparar evento de input para que React lo detecte
      const inputEvent = new Event('input', { bubbles: true });
      target.dispatchEvent(inputEvent);
      
      // Llamar callbacks
      onValueChange?.(newValue);
    }
    
    // Llamar al onPaste original
    onPaste?.(e);
  };

  return (
    <Input
      {...props}
      onChange={handleChange}
      onPaste={handlePaste}
    />
  );
};