
import { IProduct } from '@/interfaces';
import useSWR, { SWRConfiguration } from 'swr';
// const fetcher = (...args:[key:string]) => fetch(...args).then((res) => res.json());

interface Props {
    url: string;
    config?: SWRConfiguration;

}

export const useProducts = ({url, config = {}}:Props) => {

    const { data, error } = useSWR<IProduct[]>(`/api/${url}`, config);



    return {
        products: data || [] ,
        isLoading: !error && !data,
        isError:error
    }

}