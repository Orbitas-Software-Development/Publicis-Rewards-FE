import { useContext } from 'react';
import { RedemptionContext } from '../contexts/RedemptionContext';

export const useRedemptions = () => useContext(RedemptionContext);
