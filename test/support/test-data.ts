export interface UserCredentials {
  email: string;
  password: string;
}

export function createUserCredentials(): UserCredentials {
  return {
    email: `automation.${Date.now()}@example.com`,
    password: 'StrongPassword123!',
  };
}

export const invalidCredentials: UserCredentials = {
  email: 'automation@example.com',
  password: 'wrong',
};
