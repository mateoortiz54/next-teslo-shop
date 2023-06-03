import { ICartProduct, ISize } from "@/interfaces";
import { Box, Button } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface Props {
    selectedSize?: ISize;
    sizes: ISize[];
    changedSizeProductCart: (size:ISize)=>void;
}

export const SizeSelector = ({selectedSize, sizes, changedSizeProductCart}:Props) => {

  return (

    <Box>

        {
            sizes.map(size => (
                <Button
                    key={size}
                    size='small'
                    color={selectedSize === size ? 'secondary' : 'info'}
                    onClick={() =>changedSizeProductCart(size)}
                >
                    {size}
                </Button>    
            ))
        }
    </Box>


  )
}
