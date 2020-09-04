import { TRA } from '../interfaces/tra';

export interface TRAPatchMappingResponseInterface{
    name: string,
    traid: number,
    patchcrmid: string
}

const apiTRAToUiTRA = (tras: TRAPatchMappingResponseInterface[]): TRA[] => {
    return tras.map(tra => ({
        id: tra.traid,
        name: tra.name,
        patchid: tra.patchcrmid
    }))
}

export default apiTRAToUiTRA;