import axios from 'axios';
import { TRA } from '../../interfaces/tra';
//import apiTRAToUiTRA from '../../mappings/apiTRAToUiTRA'

const getTRAs = async (patchId: string): Promise<TRA[]> => {
    if(process.env.NEXT_PUBLIC_API_PATH === undefined){
        return [];
    }

    const tras: any = await axios
        .get(`${process.env.NEXT_PUBLIC_API_PATH}/tras?patchId=${patchId}`)
        .then((response => {
            return response;
        }))
    return tras.data;
}

export default getTRAs;