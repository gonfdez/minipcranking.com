import React from 'react';
import { Input } from "@/components/ui/input";

export const cleanSpecialChars = (text: string): string => {
  return text
    .replace(/™/g, '') // Trademark
    .replace(/®/g, '') // Registered
    .replace(/©/g, '') // Copyright
    .replace(/℠/g, '') // Service mark
    .trim();
};

interface CleanInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const CleanInput: React.FC<CleanInputProps> = ({ 
  value = '', 
  onValueChange,
  onChange,
  onPaste,
  ...props 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = cleanSpecialChars(e.target.value);
    
    // Actualizar el valor del input si ha cambiado
    if (cleanedValue !== e.target.value) {
      e.target.value = cleanedValue;
    }
    
    onValueChange?.(cleanedValue);
    onChange?.(e);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // Interceptar el paste para limpiar antes de que se pegue
    const pastedText = e.clipboardData.getData('text');
    const cleanedText = cleanSpecialChars(pastedText);
    
    if (cleanedText !== pastedText) {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      
      // Insertar el texto limpio en la posición del cursor
      const start = target.selectionStart || 0;
      const end = target.selectionEnd || 0;
      const currentValue = target.value;
      
      const newValue = currentValue.substring(0, start) + cleanedText + currentValue.substring(end);
      target.value = newValue;
      
      // Mover el cursor al final del texto pegado
      const newCursorPosition = start + cleanedText.length;
      target.setSelectionRange(newCursorPosition, newCursorPosition);
      
      onValueChange?.(newValue);
      
      // Disparar el evento onChange manualmente
      const changeEvent = new Event('change', { bubbles: true });
      target.dispatchEvent(changeEvent);
    }
    
    onPaste?.(e);
  };

  return (
    <Input
      {...props}
      value={value}
      onChange={handleChange}
      onPaste={handlePaste}
    />
  );
};