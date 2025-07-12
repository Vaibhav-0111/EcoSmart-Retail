// src/context/ReturnsContext.tsx
"use client";

import React, { createContext, useState, ReactNode } from 'react';
import type { ReturnedItem } from '@/lib/types';
import { mockReturnedItems } from '@/lib/mock-data';

interface ReturnsContextType {
    items: ReturnedItem[];
    addItem: (item: Omit<ReturnedItem, 'id'>) => void;
    updateItem: (id: string, updates: Partial<Omit<ReturnedItem, 'id'>>) => void;
}

export const ReturnsContext = createContext<ReturnsContextType | undefined>(undefined);

export const ReturnsProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<ReturnedItem[]>(mockReturnedItems);

    const addItem = (item: Omit<ReturnedItem, 'id'>) => {
        const newId = `R-${Math.floor(Math.random() * 10000)}`;
        const newItem: ReturnedItem = { ...item, id: newId };
        setItems(prevItems => [newItem, ...prevItems]);
    };

    const updateItem = (id: string, updates: Partial<Omit<ReturnedItem, 'id'>>) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, ...updates } : item
            )
        );
    };

    return (
        <ReturnsContext.Provider value={{ items, addItem, updateItem }}>
            {children}
        </ReturnsContext.Provider>
    );
};
