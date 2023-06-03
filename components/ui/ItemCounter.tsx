import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, Chip, IconButton, Typography } from '@mui/material';

interface Props {

    currentValue: number;
    updateQuantity: (value:number) => void;
    maxValue: number;
}


export const ItemCounter = ({currentValue, maxValue, updateQuantity}:Props) => {

    const addOrRemove = (value:number) => {

        if (value === -1) {
            if (currentValue === 1) return;
            return updateQuantity(currentValue-1);
        }

        if (currentValue>=maxValue) return;


        updateQuantity(currentValue+1);
    }

  return (

        <Box display='flex' alignItems='center'>
            <IconButton 
                // disabled={currentValue <= 1 ? true: false}
                onClick={()=>addOrRemove(-1)}
            >
                <RemoveCircleOutline 
                />
            </IconButton>
            <Typography sx={{width:40, textAlign: 'center'}} >{currentValue}</Typography>
            <IconButton 
                // disabled={currentValue < maxValue ? false: true}
                onClick={()=>addOrRemove(1)}
            >
                <AddCircleOutline/>
            </IconButton>
            {
                currentValue === maxValue &&
                (<Chip label='Cantidad Maxima Alcanzada' color="error" variant='outlined' />)
                
            }
        </Box>



    )
}
