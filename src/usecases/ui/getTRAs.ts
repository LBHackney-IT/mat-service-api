import axios from 'axios';
import { TRAdetails } from '../../interfaces/tra';
import apiTRAToUiTRA from '../../mappings/apiTRAToUiTRA'
import getEmailAddress from './getEmailAddress';
import { TRA } from '../../interfaces/tra';
import { TRAPatchMappingResponseInterface } from '../../mappings/apiTRAToUiTRA'

const getTRAs = async (): Promise<TRAdetails> => {
    const emailAddress = getEmailAddress(); 
    
    if(process.env.NEXT_PUBLIC_API_PATH === undefined || emailAddress === undefined){
         return  {
            tras: [],
            officername: "",
            patchname: ""
        };
    }

    const response: any = await axios
        .get(`${process.env.NEXT_PUBLIC_API_PATH}/tras?emailAddress=${emailAddress}`)
        .then((response => {
            return response;
        }))

        const data = response.data;
        const traObjects: TRAPatchMappingResponseInterface[] = data.tras;
        const tras: TRA[] = apiTRAToUiTRA(traObjects);

    return {
        tras: tras,
        officername: data.officername,
        patchname: data.patchname
    }
}

export default getTRAs;