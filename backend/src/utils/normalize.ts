export const normalizeLimit = (limit: any) => Math.min(10, Math.max(1, Number(limit))) ?? 10;

export const normalizePage = (page: any) => Math.max(1, Number(page)) ?? 1;
