import { useContext } from 'react';
import { PrizeContext } from '../contexts/PrizeContext';

export const usePrizes = () => useContext(PrizeContext);
