const isProd = import.meta.env.MODE === 'production';

export const logInfo = (...args: any[]) => {
  if (!isProd) console.info('[INFO]', ...args);
};

export const logWarn = (...args: any[]) => {
  console.warn('[WARN]', ...args);
};

export const logError = (...args: any[]) => {
  console.error('[ERROR]', ...args);
};
