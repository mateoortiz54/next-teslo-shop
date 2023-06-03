import { useContext } from 'react';
import { Grid, Typography, Link, CardActionArea, CardMedia, Box, Button } from '@mui/material';
import NextLink from 'next/link';
import { ItemCounter } from "../ui";
import { CartContext } from "@/context";
import { ICartProduct, IOrderItem } from "@/interfaces";






interface Props {
    editable?: boolean;
    products?: IOrderItem[];
}


export const CardList = ({editable=false, products}:Props) => {

    const {cart, updateCartQuantity, removeCartProduct} = useContext(CartContext)

    const productsInCart = cart;


    const onUpdateQuantity =(product: ICartProduct, newQuantityValue:number ) => {
        product.quantity = newQuantityValue;
        updateCartQuantity(product)
    }
    const onRemoveCart =(product: ICartProduct) => {
        console.log('Entró')
        removeCartProduct(product)
    }

    const productsToShow = products ? products : cart;


    return (
    <>
        {
            productsToShow.map(product => (
            
                <Grid container spacing={2} key={product.slug+product.size} sx={{mb:1}}>
                    <Grid item xs={3}>
                        {/* TODO: llevar a la página del producto */}
                        <NextLink href={`/product/${product.slug}`} passHref legacyBehavior>
                            <Link>
                                <CardActionArea>
                                    <CardMedia 
                                        image={product.image}
                                        component='img'
                                        sx={{borderRadius:'5px'}}
                                    />

                                </CardActionArea>
                            </Link>
                        </NextLink>
                    </Grid>
                    <Grid item xs={7}>
                        <Box display='flex' flexDirection='column'>
                            <Typography variant="body1" >{product.title}</Typography>
                            <Typography variant="body1" >Talla: <strong>{product.size}</strong></Typography>

                            {
                                editable 
                                ? <ItemCounter
                                        currentValue={product.quantity}
                                        updateQuantity={(value) => onUpdateQuantity(product as ICartProduct, value)}
                                        maxValue={5}
                                    />
                                : <Typography variant="h5">{product.quantity}{product.quantity > 1 ? 'productos': 'producto'}</Typography>
                                
                            }

                        </Box>
                    </Grid>
                    <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                        <Typography variant="subtitle1">${product.price}</Typography>

                        {
                            editable && ( 
                                <Button 
                                    variant="text" 
                                    color="secondary"
                                    onClick={()=> onRemoveCart(product as ICartProduct)}    
                                >
                                    Remover
                                </Button>
                            )

                        }

                    </Grid>

                </Grid>


                // <Typography key={product.slug}>{product.title}</Typography>
                
            ))
        }
    
    </>
  )
}
