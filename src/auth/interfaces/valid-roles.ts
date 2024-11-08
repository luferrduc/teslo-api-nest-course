
// export enum ValidRoles {
//   admin = 'admin',
//   superUser = 'super-user',
//   user = 'user'
// }

export const VALID_ROLES = {
  user: 'user',
  admin: 'admin',
  superUser: 'super-user'
} as const;

export type ValidRoles = (typeof VALID_ROLES)[keyof typeof VALID_ROLES];