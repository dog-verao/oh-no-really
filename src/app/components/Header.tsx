import { Stack, Typography } from "@mui/material";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <Stack spacing={2} pt={8} pl={5}>
      <Typography variant="h6">{title}</Typography>
      {subtitle && <Typography variant="body1">{subtitle}</Typography>}
    </Stack>
  );
};