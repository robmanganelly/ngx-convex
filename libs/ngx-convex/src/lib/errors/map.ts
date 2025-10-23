export const ERRORS = {
  NGXCB001: {
    message:
      'NGXCB001: Convex client has been destroyed and can no longer be used.',
    code: 'NGXCB001',
  } as const,
};

type K = keyof typeof ERRORS;
type V = (typeof ERRORS)[K];
type C = V['code'];

export function throwLibError(code: C): never {
  throw new Error(ERRORS[code].message);
}
