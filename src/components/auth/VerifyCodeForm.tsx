import { useState, useRef, useEffect } from 'react';

interface VerifyCodeFormProps {
  onSubmit: (code: string) => void;
  loading: boolean;
}

export default function VerifyCodeForm({ onSubmit, loading }: VerifyCodeFormProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    if (/^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        if (inputs.current[index + 1]) {
          inputs.current[index + 1]?.focus();
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const pasteArray = pasteData.split('');
      setCode(pasteArray);
      inputs.current[5]?.focus();
    }
  };

  useEffect(() => {
    if (code.every(digit => digit !== '') && !loading) {
      onSubmit(code.join(''));
    }
  }, [code, onSubmit, loading]);

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-center space-x-4">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={el => { inputs.current[index] = el; }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={loading}
            className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
            autoFocus={index === 0}
          />
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 mt-4">
        {loading ? (
          <span>Vérification en cours...</span>
        ) : (
          <span>Entrez le code à 6 chiffres</span>
        )}
      </div>
    </div>
  );
}