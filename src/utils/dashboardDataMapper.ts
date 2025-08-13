import type { AdminDashboardDto, PrizeRedemptionSummary } from '../types/dashboard/AdminDashboardDto';
import type { CollaboratorDashboardDto } from '../types/dashboard/CollaboratorDashboardDto';
import type { ManagerDashboardDto } from '../types/dashboard/ManagerDashboardDto';

export interface CardItem {
  label: string;
  value: number;
  color: string;
  path: string;
}

export interface PieItemBasic {
  name: string;
  value: number;
}

export interface PieItemWithPercentage {
  name: string;
  value: number;
  percentage: number;
}

export interface BarItem {
  name: string;
  [key: string]: number | string;
}

export interface BarItemWithDetail {
  name: string;
  value: number;
  points: number;

}

interface DashboardDataResult {
  cards: CardItem[];
  pieDataAdmin: PieItemBasic[];
  pieDataManager: PieItemWithPercentage[];
  pieDataCollaborator: PieItemWithPercentage[];
  barDataRedemptionsByMonth: BarItem[];
  barDataTopPrizes: BarItem[];
  barDataSummary: BarItem[];
  barDataPointsByArea: BarItem[];
  barDataPointsByYear: BarItemWithDetail[];
  barDataMonthlyRedemptionsByTeam: BarItem[];
  barDataPeopleByArea: BarItem[];
}

export function mapDashboardData(role: string, data: AdminDashboardDto | ManagerDashboardDto | CollaboratorDashboardDto): DashboardDataResult {
  let cards: CardItem[] = [];
  let pieDataAdmin: PieItemBasic[] = [];
  let pieDataManager: PieItemWithPercentage[] = [];
  let pieDataCollaborator: PieItemWithPercentage[] = [];
  let barDataRedemptionsByMonth: BarItem[] = [];
  let barDataTopPrizes: BarItem[] = [];
  let barDataSummary: BarItem[] = [];
  let barDataPointsByArea: BarItem[] = [];
  let barDataPointsByYear: BarItemWithDetail[] = [];
  let barDataMonthlyRedemptionsByTeam: BarItem[] = [];
  let barDataPeopleByArea: BarItem[] = [];

  switch (role) {
    case 'administrador': {
      const adminData = data as AdminDashboardDto;

      cards = [
        { label: 'Colaboradores Activos', value: adminData.activeCollaboratorsCount, color: 'primary.main', path: '/colaboradores' },
        { label: 'Huellas Asignadas', value: adminData.assignedPoints, color: 'error.main', path: '/huellas/asignaciones' },
        { label: 'Canjes Realizados', value: adminData.redeemedPrizesCount, color: 'secondary.main', path: '/canjes' },
        { label: 'Premios Disponibles', value: adminData.availablePrizesCount, color: 'success.main', path: '/premios' },
      ];

      pieDataAdmin = adminData.pointsAvailableByRange.map(({ range, percentage }) => ({
        name: range,
        value: percentage,
      }));

      barDataRedemptionsByMonth = adminData.redeemedPrizesByMonth.map(({ month, count }) => ({
        name: month,
        canjes: count,
      }));

      barDataTopPrizes = adminData.topRedeemedPrizes.map(
        ({ prizeCode, prizeDescription, redemptionCount }: PrizeRedemptionSummary) => ({
          code: prizeCode,
          name: prizeDescription,
          count: redemptionCount,
        })
      );

      barDataSummary = [{
        name: 'Total',
        Asignadas: adminData.pointsAssignedVsRedeemedSummary.totalAssignedPoints,
        Canjeadas: adminData.pointsAssignedVsRedeemedSummary.totalRedeemedPoints,
      }];
      break;
    }

    case 'manager':
    case 'supervisor': {
      const managerData = data as ManagerDashboardDto;

        cards = [
            { label: 'Miembros del equipo', value: managerData.peopleUnderManagerCount, color: 'primary.main', path: '/equipo' },
            
        ];

        if (role === 'manager') {
            // Cards exclusivas para manager
            cards.push(
            { label: 'Huellas disponibles a entregar', value: managerData.pointsAvailableToAssign, color: 'secondary.main', path: '/huellas/asignaciones' },    
            { label: 'Huellas entregadas', value: managerData.totalPointsAssignedByManager, color: 'error.main', path: '/huellas/asignaciones' }
            );
        } else if (role === 'supervisor') {
            // Cards exclusivas para supervisor
            cards.push(
            { label: 'Saldo actual de huellas', value: managerData.currentPointsBalanceTeam ?? 0, color: 'secondary.main', path: '/equipo' },
            { label: 'Huellas ganadas por equipo', value: managerData.totalPointsEarnedByTeam ?? 0, color: 'error.main', path: '/equipo' }
            );
        }

        cards.push(
            { label: 'Premios canjeados por equipo', value: managerData.totalRedeemedPrizesByTeam, color: 'success.main', path: '/canjes' },
        )

      pieDataManager = managerData.pointsDistributionByCategory.map(
        ({ category, points, percentage }) => ({
          name: category,
          value: points,
          percentage,
        })
      );

      barDataPointsByArea = managerData.pointsAssignedByArea.map(({ area, pointsAssigned }) => ({
        name: area,
        points: pointsAssigned,
      }));

      barDataMonthlyRedemptionsByTeam = managerData.monthlyRedeemedPrizesByTeam.map(({ month, count }) => ({
        name: month,
        canjes: count,
      }));

      barDataPeopleByArea = managerData.peopleByArea.map(({ area, peopleCount }) => ({
        name: area,
        count: peopleCount,
      }));
      break;
    }

    case 'colaborador': {
      const collaboratorData = data as CollaboratorDashboardDto;

      cards = [
        { label: 'Huellas Ganadas', value: collaboratorData.totalPointsEarned, color: 'primary.main', path: '/mis-huellas' },
        { label: 'Huellas Canjeadas', value: collaboratorData.totalPointsRedeemed, color: 'error.main', path: '/historial' },
        { label: 'Saldo Actual', value: collaboratorData.currentPointsBalance, color: 'secondary.main', path: '/mis-huellas' },
        { label: 'Total de Canjes', value: collaboratorData.totalRedemptionsCount, color: 'success.main', path: '/historial' },
      ];

      pieDataCollaborator = collaboratorData.pointsByReason.map(({ reason, points, percentage }) => ({
        name: reason,
        value: points,
        percentage,
      }));

      barDataPointsByYear = collaboratorData.redeemedPointsByYear.map(({ year, points, redemptionsCount }) => ({
        name: year.toString(),
        value: redemptionsCount,  
        points,             
      }));

    }
  }

  return {
    cards,
    pieDataAdmin,
    pieDataManager,
    pieDataCollaborator,
    barDataRedemptionsByMonth,
    barDataTopPrizes,
    barDataSummary,
    barDataPointsByArea,
    barDataPointsByYear,
    barDataMonthlyRedemptionsByTeam,
    barDataPeopleByArea
  };
}
