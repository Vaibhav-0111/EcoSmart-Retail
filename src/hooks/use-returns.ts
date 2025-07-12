// src/hooks/use-returns.ts
import { useContext } from 'react';
import { ReturnsContext } from '@/context/ReturnsContext';

export const useReturns = () => {
    const context = useContext(ReturnsContext);
    if (context === undefined) {
        throw new Error('useReturns must be used within a ReturnsProvider');
    }
    return context;
};
