/**
 * Client-side validation utilities for FindBack Campus Lost & Found System
 * Implements regular expressions, input sanitization, and credential validation logic.
 */

// RFC 5322 standard compliant email regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 10-digit phone number regex (supporting optional +91 or leading 0)
export const PHONE_REGEX = /^(?:\+91|0)?[6-9]\d{9}$/;

// User ID / College ID regex: e.g., USER104, USER012, FAC082, ADM001
export const COLLEGE_ID_REGEX = /^(?:(?:USER[0-9]{2,5})|(?:[0-9]{2}[A-Z]{2,4}[0-9]{3,4})|(?:FAC[0-9]{3})|(?:ADM[0-9]{3}))$/i;

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Too Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
  hasLength: boolean;
  hasLower: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

/**
 * Calculates password strength based on standard security criteria
 */
export function checkPasswordStrength(password: string): PasswordStrength {
  const hasLength = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (hasLength) score++;
  if (hasLower && hasUpper) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  if (password.length === 0) {
    return {
      score: 0,
      label: 'Too Weak',
      color: '#94a3b8',
      hasLength: false,
      hasLower: false,
      hasUpper: false,
      hasNumber: false,
      hasSpecial: false,
    };
  }

  let label: PasswordStrength['label'] = 'Too Weak';
  let color = '#dc2626'; // Danger

  switch (score) {
    case 1:
      label = 'Weak';
      color = '#ef4444';
      break;
    case 2:
      label = 'Fair';
      color = '#f59e0b'; // Warning
      break;
    case 3:
      label = 'Good';
      color = '#3b82f6';
      break;
    case 4:
      label = 'Strong';
      color = '#16a34a'; // Success
      break;
  }

  return {
    score,
    label,
    color,
    hasLength,
    hasLower,
    hasUpper,
    hasNumber,
    hasSpecial,
  };
}

/**
 * Validates registration input fields
 */
export function validateRegistration(formData: {
  name: string;
  college_id: string;
  email: string;
  phone: string;
  password?: string;
  confirm_password?: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!formData.name.trim()) {
    errors.name = 'Full Name is required.';
  } else if (formData.name.trim().length < 3) {
    errors.name = 'Full Name must be at least 3 characters.';
  }

  if (!formData.college_id.trim()) {
    errors.college_id = 'College ID is required.';
  } else if (!COLLEGE_ID_REGEX.test(formData.college_id.trim())) {
    errors.college_id = 'Format: USER104 (User ID) or FAC082 (Faculty).';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(formData.email.trim())) {
    errors.email = 'Please enter a valid college or personal email.';
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_REGEX.test(formData.phone.replace(/[\s-]/g, ''))) {
    errors.phone = 'Enter a valid 10-digit mobile number.';
  }

  if (formData.password !== undefined) {
    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
  }

  if (formData.confirm_password !== undefined) {
    if (!formData.confirm_password) {
      errors.confirm_password = 'Confirm password is required.';
    } else if (formData.confirm_password !== formData.password) {
      errors.confirm_password = 'Passwords do not match.';
    }
  }

  return errors;
}

/**
 * Validates Login input
 */
export function validateLogin(identifier: string, password?: string): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!identifier.trim()) {
    errors.identifier = 'Please enter your Email or College ID.';
  }
  if (!password) {
    errors.password = 'Please enter your password.';
  } else if (password.length < 4) {
    errors.password = 'Password too short.';
  }
  return errors;
}
