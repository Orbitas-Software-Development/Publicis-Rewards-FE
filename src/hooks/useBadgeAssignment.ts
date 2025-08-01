import { useContext } from 'react';
import { BadgeAssignmentContext } from '../contexts/BadgeAssignmentContext';


export const useBadgeAssignments = () => useContext(BadgeAssignmentContext);