import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    Box,
} from '@mui/material';
import {
    AccountCircle,
    Logout,
    AccessTime,
} from '@mui/icons-material';

interface DashboardHeaderProps {
    title: string;
    icon: React.ReactNode;
    onRefresh: () => void;
    onLogout: () => void;
    user: { nome: string; email: string } | null;
    additionalMenuItems?: React.ReactNode;
    additionalToolbarItems?: React.ReactNode;
    gradient?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    title,
    icon,
    onRefresh,
    onLogout,
    user,
    additionalMenuItems,
    additionalToolbarItems,
    gradient = 'linear-gradient(135deg, #0B5D5E 0%, #0E7575 100%)',
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleRefreshClick = () => {
        onRefresh();
        handleMenuClose();
    };

    const handleLogoutClick = () => {
        onLogout();
        handleMenuClose();
    };

    return (
        <AppBar
            position="sticky"
            sx={{
                background: gradient,
                boxShadow: '0 4px 15px rgba(11, 93, 94, 0.3)',
                zIndex: 1201,
            }}
        >
            <Toolbar>
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    {icon}
                </Box>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    {title}
                </Typography>

                {additionalToolbarItems}

                <IconButton color="inherit" onClick={handleMenuOpen}>
                    <AccountCircle />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem disabled>
                        <Box>
                            <Typography variant="body2" fontWeight="bold">
                                {user?.nome || 'Usuário'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {user?.email}
                            </Typography>
                        </Box>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleRefreshClick}>
                        <AccessTime sx={{ mr: 1 }} fontSize="small" />
                        Atualizar
                    </MenuItem>

                    {additionalMenuItems}

                    <MenuItem onClick={handleLogoutClick}>
                        <Logout sx={{ mr: 1 }} fontSize="small" />
                        Sair
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default DashboardHeader;
