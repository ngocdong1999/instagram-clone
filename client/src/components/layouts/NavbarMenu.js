import { memo, useCallback, useContext,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import logo from '../../assets/text-logo.png'


import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import { Link } from 'react-router-dom';
import { Divider, ListItemIcon, Stack } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import HomeIcon from '@mui/icons-material/Home';
import SearchInput from '../auth/SearchInput';
import AvatarUser from '../auth/AvatarUser';
import AddPostModal from '../posts/AddPostModal';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';



function NavbarMenu() {
    const {authState: {user}, logoutUser} = useContext(AuthContext)
    const [showAddPostModal,setShowAddPostModal] = useState(false)
    const { username, firstname, lastname, image } = user
    const navigate = useNavigate()
    // const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
  
    // const handleOpenNavMenu = (event) => {
    //   setAnchorElNav(event.currentTarget);
    // };

    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
    const goToHome = () => {
        navigate('/home')
    }
    // const handleCloseNavMenu = () => {
    //   setAnchorElNav(null);
    // };
  
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };
    const handleShowModal = () => {
        setShowAddPostModal(true)
    }
    const handleCloseModal = useCallback(() => {
        setShowAddPostModal(false)
    },[])
    return (
        <AppBar position="sticky" color='transparent'  className='!bg-[#ffffff] !shadow-none border-b border-[#dbdbdb] border-solid'>
            <Container maxWidth="md">
                <Toolbar disableGutters className='!min-h-[60px]'>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ mr: 2,flex: '1 0 60px', display: { xs: 'none', md: 'flex' } }}
                    >
                        <Link to='/'>
                            <img src={logo} alt='Logo'></img>
                        </Link>
                    </Typography>
                    
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', md: 'none' } }}
                    >
                        <img src={logo} alt='Logo'></img>
                    </Typography>
                    <SearchInput/>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ flexGrow: 0 }}>
                        <Stack direction="row" spacing={1.75}>
                            <IconButton sx={{color:'#000000'}} onClick={goToHome}>
                                <HomeIcon fontSize='medium'></HomeIcon>
                            </IconButton>
                            <IconButton sx={{color:'#000000'}} onClick={handleShowModal}>
                                <AddBoxOutlinedIcon fontSize='medium' ></AddBoxOutlinedIcon>
                            </IconButton>

                            <Tooltip title="Trang cá nhân">
                                <IconButton onClick={handleOpenUserMenu}>
                                    <AvatarUser image={image} firstname={firstname} lastname={lastname} sizeImage={{width: '24px', height: '24px'}} sizeImageString={{width: '24px', height: '24px', fontSize: '14px'}} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={handleCloseUserMenu} sx={{fontSize: '14px'}}>
                                <Link to={username} className='flex'>
                                    <ListItemIcon>
                                        <AccountCircleOutlinedIcon fontSize="small"/>
                                    </ListItemIcon>
                                    Trang cá nhân</Link>
                                </MenuItem>
                                <Divider sx={{borderColor: 'transparent'}}></Divider>
                                <MenuItem onClick={handleCloseUserMenu} sx={{fontSize: '14px'}}>
                                    <Link to='account/password/change' className='flex'>
                                        <ListItemIcon>
                                            <PasswordOutlinedIcon />
                                        </ListItemIcon>
                                        Đổi mật khẩu
                                    </Link>
                                </MenuItem>
                                <Divider></Divider>
                                <MenuItem onClick={logoutUser} sx={{fontSize: '14px'}}>
                                    <ListItemIcon>
                                        <LogoutOutlinedIcon  fontSize="small"/>
                                    </ListItemIcon>
                                    Đăng xuất
                                </MenuItem>
                            </Menu>
                        </Stack>
                        <AddPostModal show={showAddPostModal} onCloseModal={handleCloseModal}></AddPostModal>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default memo(NavbarMenu)