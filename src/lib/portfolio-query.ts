import { queryOptions } from '@tanstack/react-query';
import { getPortfolio } from './portfolio.functions';
export const portfolioQuery = queryOptions({ queryKey: ['portfolio'], queryFn: () => getPortfolio(), staleTime: 60000 });
export type PortfolioProject = Awaited<ReturnType<typeof getPortfolio>>['projects'][number];
