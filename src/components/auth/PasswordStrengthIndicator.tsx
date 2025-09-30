"use client";

interface PasswordStrengthIndicatorProps {
    password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
    const calculateStrength = (password: string) => {
        let strength = 0;

        if (password.length >= 8) strength += 25;
        if (password.match(/[a-z]/)) strength += 25;
        if (password.match(/[A-Z]/)) strength += 25;
        if (password.match(/[0-9]/)) strength += 12.5;
        if (password.match(/[^a-zA-Z0-9]/)) strength += 12.5;

        return Math.min(strength, 100);
    };

    const getStrengthColor = (strength: number) => {
        if (strength < 25) return 'bg-red-500';
        if (strength < 50) return 'bg-orange-500';
        if (strength < 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStrengthText = (strength: number) => {
        if (strength < 25) return 'Weak';
        if (strength < 50) return 'Fair';
        if (strength < 75) return 'Good';
        return 'Strong';
    };

    const strength = calculateStrength(password);

    if (!password) return null;

    return (
        <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Password strength:</span>
                <span className={`font-medium ${
                    strength < 25 ? 'text-red-600' :
                        strength < 50 ? 'text-orange-600' :
                            strength < 75 ? 'text-yellow-600' :
                                'text-green-600'
                }`}>
          {getStrengthText(strength)}
        </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength)}`}
                    style={{ width: `${strength}%` }}
                ></div>
            </div>
        </div>
    );
}