import { IProduct } from '@/interfaces'
import { Grid, Card, CardActionArea, CardMedia, Box, Typography, Link, Chip } from '@mui/material';
import React, { useMemo, useState } from 'react'

import NextLink from 'next/link'

interface Props {
    product : IProduct;
}

export const ProductCard = ({product}:Props) => {

  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const productImage = useMemo(()=>{
      return isHovered
      ? product.images[1]
      : product.images[0]
  }, [isHovered, product.images])


  return (
    <Grid item 
      xs={4} 
      sm={4}
      onMouseEnter={()=>setIsHovered(true)}
      onMouseLeave={()=>setIsHovered(false)}
    >
        <Card>
        <NextLink href={`/product/${product.slug}`} passHref legacyBehavior prefetch={false}>
            <Link>



              <CardActionArea>
                {
                  product.inStock === 0 && (
                      <Chip
                        color='error'
                        label='No hay disponibles'
                        sx={{position: 'absolute', zIndex: 99, top: '10px', left: '10px'}}
                      />
                    
                    )
                
                }
                <CardMedia 
                    component='img'
                    className='fadeIn'
                    image={productImage}
                    alt={product.title}
                    // Cuando se carga la imagen podemos correr una función
                    onLoad={() => setIsImageLoaded(true)}
                />
              </CardActionArea>
              
            </Link>
          </NextLink>
        </Card>

        <Box
          sx={{mt: 1, display: isImageLoaded ? 'block' : 'none'}}
          className='fadeIn'

        >
          <Typography fontWeight={700}>{product.title}</Typography>
          <Typography fontWeight={500}>${product.price}</Typography>
        </Box>

    </Grid>
  )
}
