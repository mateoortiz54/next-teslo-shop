import NextLink from 'next/link'

import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { CartContext, UiContext } from '@/context';
import { ClearOutlined } from '@mui/icons-material';



export const Navbar = () => {

  const {toggleSideMenu} = useContext(UiContext);
  const {numberOfItem} = useContext(CartContext);

  const {pathname, push} = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearch = () =>{
      if (searchTerm.trim().length === 0) return;
      push(`/search/${searchTerm}`);
  }


  return (

    <AppBar>
        <Toolbar>
        <NextLink href='/' passHref legacyBehavior>
            <Link display='flex' alignItems='center'>

                <Typography variant='h6'>Teslo |</Typography>
                <Typography sx={{ml: 0.5}}>Shop</Typography>

            </Link>
        </NextLink> 

        <Box flex={1}/>


        <Box sx={{display: isSearchVisible ? 'none' : {xs: 'none', sm: 'block'}}}
            className='fadeIn'
            >
          <NextLink href='/category/men' passHref legacyBehavior>
            <Link >
              <Button color={pathname === '/category/men'? 'secondary' : 'primary'} > 
                  Hombres
              </Button>
            </Link>
          </NextLink>
          <NextLink href='/category/women' passHref legacyBehavior>
            <Link>
              <Button color={pathname === '/category/women'? 'secondary' : 'primary'}>
                  Mujeres
              </Button>
            </Link>
          </NextLink>
          <NextLink href='/category/kid' passHref legacyBehavior>
            <Link>
              <Button color={pathname === '/category/kid'? 'secondary' : 'primary'}>
                  Niños
              </Button>
            </Link>
          </NextLink>
        </Box>


        <Box sx={{flex:1}}/>



        {/* pantallas Grandes */}

        {
          isSearchVisible
          ?(
            <Input
                sx={{display: {xs: 'none', sm: 'flex'}}}
                className='fadeIn'
                autoFocus
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' ? onSearch() :'' }
                type='text'
                placeholder="Buscar..."
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={()=> setIsSearchVisible(false)}
                        >
                          <ClearOutlined />
                        </IconButton>
                    </InputAdornment>
                }
            />
          )
          :(
              <IconButton 
                onClick={()=> setIsSearchVisible(true)}
                className='fadeIn'
                sx={{display: {xs: 'none', sm: 'flex'}}}

              >
                <SearchOutlinedIcon />
              </IconButton>   
            )
        }
        
        {/* Pantallas pequeñas */}
        <IconButton
          sx={{display: {xs: 'flex', sm: 'none'}}}
          onClick={toggleSideMenu}
        >
            <SearchOutlinedIcon />
        </IconButton>
        
        <NextLink href='/cart' passHref legacyBehavior>
            <Link>
              <IconButton>
                  <Badge badgeContent={numberOfItem>9 ? '+9' : numberOfItem}>
                    <ShoppingCartOutlinedIcon />
                  </Badge>
              </IconButton>
            </Link>
        </NextLink>

        <Button onClick={toggleSideMenu}>
          Menú
        </Button>

        </Toolbar>
    </AppBar>


  )
}
