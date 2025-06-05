import '@testing-library/jest-dom';

declare module 'vitest' {
  import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

  interface Assertion<T = any> extends TestingLibraryMatchers<T, void> {}
}
