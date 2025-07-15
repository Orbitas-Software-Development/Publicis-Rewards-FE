import { useState, type JSX } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import type { EmployeeDto } from '../../types/Employee';
import { EmployeeTableToolbar } from '../../components/main/employee/EmployeeTableToolbar';
import { useEmployees } from '../../hooks/useEmployee';
import FullPageLoader from '../../components/main/utils/FullPageLoader';
import { Icon } from '@iconify/react/dist/iconify.js';
import ErrorMessage from '../../components/main/utils/ErrorMessage';

export default function TeamPage() {
  const { team, loading, error } = useEmployees();
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDto | null>(null);
  const [sortBy, setSortBy] = useState<'employeeNumber' | 'fullName' | 'email' | 'hireDate'>('employeeNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const filteredEmployees = team.filter((emp) => {
    const lowerFilter = filterText.toLowerCase();

    const matchesText =
      emp.fullName.toLowerCase().includes(lowerFilter) ||
      emp.email.toLowerCase().includes(lowerFilter) ||
      emp.employeeNumber.toLowerCase().includes(lowerFilter);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && emp.active) ||
      (statusFilter === 'inactive' && !emp.active);

    const hireDate = new Date(emp.hireDate);
    const fromDate = dateRangeFilter.from ? new Date(dateRangeFilter.from) : null;
    const toDate = dateRangeFilter.to ? new Date(dateRangeFilter.to) : null;

    let matchesDate = true;
    if (fromDate && hireDate < fromDate) matchesDate = false;
    if (toDate && hireDate > toDate) matchesDate = false;

    return matchesText && matchesStatus && matchesDate;
  });


  const getSortedEmployees = (list: EmployeeDto[]) => {
    return [...list].sort((a, b) => {
      if (sortBy === 'hireDate') {
        const dateA = new Date(a.hireDate).getTime();
        const dateB = new Date(b.hireDate).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const valA = (a[sortBy] as string).toLowerCase();
        const valB = (b[sortBy] as string).toLowerCase();

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
    });
  };

  const handleSort = (property: typeof sortBy) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortBy(property);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleExpand = (employeeNumber: string) => {
    setExpandedParents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(employeeNumber)) {
        newSet.delete(employeeNumber);
      } else {
        newSet.add(employeeNumber);
      }
      return newSet;
    });
  };

  const startIndex = page * rowsPerPage;

  const currentParents = getSortedEmployees(filteredEmployees).slice(startIndex, startIndex + rowsPerPage);

  const isShortResult = currentParents.length > 0 && currentParents.length < 6;


  if (loading) return <FullPageLoader />;

  if (error) {
    return <ErrorMessage message={error} />;
  }


const renderEmployeeRow = (
  emp: EmployeeDto,
  depth: number,
  rowIndex: string
): JSX.Element[] => {
  const isSelected = selectedEmployee?.employeeNumber === emp.employeeNumber;
  const isExpanded = expandedParents.has(emp.employeeNumber);

  const rows: JSX.Element[] = [];

  rows.push(
    <TableRow
      key={emp.employeeNumber}
      hover
      selected={isSelected}
      onClick={() => {
        setSelectedEmployee(emp);
        if (emp.team && emp.team.length > 0) {
          toggleExpand(emp.employeeNumber);
        }
      }}
      sx={{
        cursor: emp.team?.length ? 'pointer' : 'default',
        backgroundColor: isSelected ? theme.palette.action.selected : 'inherit',
      }}
    >
      <TableCell sx={{pr:0}}>
        {emp.team && emp.team.length > 0 && (
          <Icon
            icon={isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'}
            width={20}
            height={20}
          />
        )}
      </TableCell>

      <TableCell>
        <Typography fontSize={16} fontWeight={'bold'}>{rowIndex}</Typography>
      </TableCell>

      <TableCell>
        <Typography fontSize={16} sx={{ pl: depth * 4 }}>
          {emp.employeeNumber}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography fontSize={16}>{emp.fullName}</Typography>
      </TableCell>

      <TableCell>
        <Typography fontSize={16}>{emp.email}</Typography>
      </TableCell>

      <TableCell>
        <Typography fontSize={16}>
          {new Date(emp.hireDate).toLocaleDateString()}
        </Typography>
      </TableCell>

      <TableCell>
        <Box
          sx={{
            display: 'inline-block',
            px: 1,
            py: 0.5,
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: 14,
            backgroundColor: emp.active
              ? theme.palette.success.light
              : theme.palette.error.light,
            color: emp.active ? theme.palette.success.dark : theme.palette.error.dark,
            textAlign: 'center',
          }}
        >
          {emp.active ? 'Activo' : 'Inactivo'}
        </Box>
      </TableCell>
    </TableRow>
  );

  if (isExpanded && emp.team && emp.team.length > 0) {
    emp.team.forEach((child, index) => {
      rows.push(...renderEmployeeRow(child, depth + 1, `${rowIndex}.${index + 1}`));
    });
  }

  return rows;
};


  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        height: isDesktop ? '100%' : 'auto',
        gap: 3,
        overflow: isDesktop ? 'hidden' : 'visible',
      }}
    >
      <Box px={2} pt={1}>
        <Typography
          variant="h3"
          fontWeight="bold"
          color="primary.dark"
          textAlign="left"
          sx={{ fontSize: 'clamp(1.7rem, 4vw, 2rem)' }}
        >
          Equipo de Trabajo
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          mt={0.5}
        >
          Visualiza y administra los colaboradores que forman parte de tu equipo.
        </Typography>
      </Box>

      <Card
        sx={{
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06)',
          backgroundColor: 'background.paper',
          mx: 2,
          height: '100%',
        }}
      >
        <EmployeeTableToolbar
          filterValue={filterText}
          onFilterChange={(e) => {
            setFilterText(e.target.value);
            setPage(0);
          }}
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
            setPage(0);
          }}
          dateFrom={dateRangeFilter.from}
          dateTo={dateRangeFilter.to}
          onDateFromChange={(value) => {
            setDateRangeFilter((prev) => ({ ...prev, from: value }));
            setPage(0);
          }}
          onDateToChange={(value) => {
            setDateRangeFilter((prev) => ({ ...prev, to: value }));
            setPage(0);
          }}
        />

        <TableContainer
          sx={{
            flexGrow: 1,
            minHeight: '300px',
            maxHeight: '70vh',
          }}
        >
          <Table stickyHeader sx={{ height: isShortResult ? 'auto' : '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: theme.palette.publicisGrey.main }} />
                <TableCell sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
                  <Typography variant="subtitle2" fontSize={16}>
                    #
                  </Typography>
                </TableCell>
                <TableCell
                  sortDirection={sortBy === 'employeeNumber' ? sortOrder : false}
                  sx={{ backgroundColor: theme.palette.publicisGrey.main }}
                >
                  <TableSortLabel
                    active={sortBy === 'employeeNumber'}
                    direction={sortBy === 'employeeNumber' ? sortOrder : 'asc'}
                    onClick={() => handleSort('employeeNumber')}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={sortBy === 'employeeNumber' ? 'bold' : '500'}
                      fontSize={16}
                    >
                      Número de Empleado
                    </Typography>
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  sortDirection={sortBy === 'fullName' ? sortOrder : false}
                  sx={{ backgroundColor: theme.palette.publicisGrey.main }}
                >
                  <TableSortLabel
                    active={sortBy === 'fullName'}
                    direction={sortBy === 'fullName' ? sortOrder : 'asc'}
                    onClick={() => handleSort('fullName')}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={sortBy === 'fullName' ? 'bold' : '500'}
                      fontSize={16}
                    >
                      Nombre
                    </Typography>
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  sortDirection={sortBy === 'email' ? sortOrder : false}
                  sx={{ backgroundColor: theme.palette.publicisGrey.main }}
                >
                  <TableSortLabel
                    active={sortBy === 'email'}
                    direction={sortBy === 'email' ? sortOrder : 'asc'}
                    onClick={() => handleSort('email')}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={sortBy === 'email' ? 'bold' : '500'}
                      fontSize={16}
                    >
                      Correo
                    </Typography>
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  sortDirection={sortBy === 'hireDate' ? sortOrder : false}
                  sx={{ backgroundColor: theme.palette.publicisGrey.main }}
                >
                  <TableSortLabel
                    active={sortBy === 'hireDate'}
                    direction={sortBy === 'hireDate' ? sortOrder : 'asc'}
                    onClick={() => handleSort('hireDate')}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={sortBy === 'hireDate' ? 'bold' : '500'}
                      fontSize={16}
                    >
                      Fecha de Ingreso
                    </Typography>
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ backgroundColor: theme.palette.publicisGrey.main }}>
                  <Typography variant="subtitle2" fontSize={16}>
                    Estado
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {currentParents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ p: 0 }}>
                    <Box
                      sx={{
                        minHeight: '300px',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="subtitle1" color="text.secondary">
                        No se encontraron colaboradores
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                 currentParents.flatMap((emp, index) =>
                  renderEmployeeRow(emp, 0, `${startIndex + index + 1}`)
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ px: 2 }}>
          <TablePagination
            component="div"
            count={filteredEmployees.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20, 50]}
            labelRowsPerPage="Filas por página"
          />
        </Box>
      </Card>
    </Box>
  );
}
