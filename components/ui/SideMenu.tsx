import { useContext, useState } from "react"
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, DashboardOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"
import { useRouter } from "next/router"
import { AuthContext, UiContext } from "@/context"


export const SideMenu = () => {

    const router = useRouter();
    const {isMenuOpen, toggleSideMenu} = useContext(UiContext);
    const {user, logout } = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState('');


    const onSearch = () =>{
        
        if (searchTerm.trim().length === 0) return;
        navigate(`/search/${searchTerm}`)

    }

    const navigate = (url:string) => {
        // conseguimos que quede en el historial a diferencia del replace
        router.push(url);
        toggleSideMenu();
    }


    const onLogout = () => {
        logout();
    
    }

  return (
    <Drawer
        open={ isMenuOpen }
        anchor='right'
        sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
        onClose={toggleSideMenu}
    >
        <Box sx={{ width: 250, paddingTop: 5 }}>
            
            <List>

                <ListItem>
                    <Input
                        autoFocus
                        value={searchTerm}
                        onChange={(e)=>setSearchTerm(e.target.value)}
                        onKeyUp={(e) => e.key === 'Enter' ? onSearch() :'' }
                        type='text'
                        placeholder="Buscar..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={onSearch}
                                >
                                 <SearchOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </ListItem>
                {
                    user && 
                    (   <>
                            <ListItem button>
                                <ListItemIcon>
                                    <AccountCircleOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Perfil'} />
                            </ListItem>
            
                            <ListItem button 
                                onClick={()=> navigate('/orders/history')}

                            >
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Mis Ordenes'} />
                            </ListItem>
                        </>

                    )
                        
                    

                }    

                <ListItem button sx={{ display: { xs: '', sm: 'none' } }}  onClick={(() => navigate('/category/men'))} >
                    <ListItemIcon>
                        <MaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Hombres'} />
                </ListItem>

                <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={(() => navigate('/category/women'))}>
                    <ListItemIcon>
                        <FemaleOutlined/>
                    </ListItemIcon>

                    <ListItemText primary={'Mujeres'} />
                </ListItem>

                <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={(() => navigate('/category/kid'))}>
                    <ListItemIcon>
                        <EscalatorWarningOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Niños'} />
                </ListItem>


                
                {
                    user 
                        ? (
                            <ListItem button onClick={onLogout}>
                                <ListItemIcon>
                                    <LoginOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Salir'} />
                            </ListItem>)

                    :(
                        <ListItem button onClick={(() => navigate(`/auth/login?p=${router.asPath}`))}>
                            <ListItemIcon>
                                <VpnKeyOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Ingresar'} />
                        </ListItem>
                    )
                    
                    
                }
                    

                {/* Admin */}
                <Divider />
                {
                    user?.role === 'admin' && (
                        <>
                            <ListSubheader>Admin Panel</ListSubheader>

                            <ListItem button
                                onClick={()=> navigate('/admin/products')}

                            >
                                <ListItemIcon>
                                    <CategoryOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Productos'} />
                            </ListItem>
                            <ListItem button
                                onClick={(() => navigate(`/admin`))}
                            >
                                <ListItemIcon>
                                    <DashboardOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Dashboard'} />
                            </ListItem>


                            <ListItem button
                                onClick={()=> navigate('/admin/orders')}
                            >
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Ordenes'} />
                            </ListItem>

                            <ListItem button
                                onClick={(() => navigate(`/admin/users`))}

                            >
                                <ListItemIcon>
                                    <AdminPanelSettings/>
                                </ListItemIcon>
                                <ListItemText primary={'Usuarios'} />
                            </ListItem>    
                        
                        </>
                    )
                }
                
            </List>
        </Box>
    </Drawer>
  )
}