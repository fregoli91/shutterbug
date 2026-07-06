export const PASSWORD_MIN_LENGTH = 15;
export const PASSWORD_MAX_LENGTH = 128;

const weakPasswordFragments = [
  'password',
  'qwerty',
  'letmein',
  'welcome',
  'admin',
  'login',
  'shutterbug',
  'camera123',
  '123456',
  '111111',
  '000000',
  'abcdef',
  'abc123'
];

export type PasswordValidationResult = {
  valid: boolean;
  code?: 'too-short' | 'too-long' | 'common' | 'personal' | 'repeated';
  message?: string;
};

export function validateCustomerPassword({
  password,
  email,
  name
}: {
  password: string;
  email?: string;
  name?: string;
}): PasswordValidationResult {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      code: 'too-short',
      message: `Use at least ${PASSWORD_MIN_LENGTH} characters.`
    };
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return {
      valid: false,
      code: 'too-long',
      message: `Use ${PASSWORD_MAX_LENGTH} characters or fewer.`
    };
  }

  const normalized = password.toLowerCase().replace(/\s+/g, '');
  if (weakPasswordFragments.some((fragment) => normalized.includes(fragment))) {
    return {
      valid: false,
      code: 'common',
      message: 'Avoid common words, keyboard patterns, and obvious Shutterbug/camera phrases.'
    };
  }

  if (/(.)\1{7,}/i.test(password)) {
    return {
      valid: false,
      code: 'repeated',
      message: 'Avoid long repeated character runs.'
    };
  }

  const normalizedEmail = email?.trim().toLowerCase();
  const localPart = normalizedEmail?.split('@')[0] ?? '';
  const nameParts = name
    ?.toLowerCase()
    .split(/\s+/)
    .map((part) => part.replace(/[^a-z0-9]/g, ''))
    .filter((part) => part.length >= 4);
  const personalTokens = [localPart, ...(nameParts ?? [])].filter((part) => part.length >= 4);

  if (personalTokens.some((token) => normalized.includes(token))) {
    return {
      valid: false,
      code: 'personal',
      message: 'Avoid using your name or email address in the password.'
    };
  }

  return { valid: true };
}
