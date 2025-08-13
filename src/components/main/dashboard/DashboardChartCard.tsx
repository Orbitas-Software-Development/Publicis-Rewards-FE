import { Card, CardContent, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

interface DashboardChartCardProps {
  title: string;
  height?: number | string;
  children: ReactNode;
  empty?: boolean;
  emptyMessage?: string;
}

export const DashboardChartCard = ({
  title,
  height = 300,
  children,
  empty = false,
  emptyMessage = "No hay datos disponibles para mostrar.",
}: DashboardChartCardProps) => {
  return (
    <Card
      sx={{
        minHeight: height,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.06)",
        borderRadius: 3,
        "&:hover": {
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      </CardContent>

      <Box
        sx={{
          flexGrow: 1,
          height,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {empty ? (
          <Typography variant="subtitle1" color="text.secondary" textAlign="center">
            {emptyMessage}
          </Typography>
        ) : (
          children
        )}
      </Box>
    </Card>
  );
};
