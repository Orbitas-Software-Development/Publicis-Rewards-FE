import { useContext } from 'react';
import { BadgeCategoryContext } from '../contexts/BadgeCategoryContext';

export const useBadgeCategories = () => useContext(BadgeCategoryContext);
