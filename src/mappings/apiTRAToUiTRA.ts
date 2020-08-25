import { TRA } from '../interfaces/tra';

export interface TRAPatchMappingDBResponseInterface{
    traid: number,
    name: string,
    patchcrmid: string
}

const apiTRAToUiTRA = (tras: TRAPatchMappingDBResponseInterface[]): TRA[] => {
    const mappedTRAs: TRA[] = [];

    tras.forEach((element: TRAPatchMappingDBResponseInterface) =>{
        mappedTRAs.push({
            id: element.traid,
            name: element.name,
            patchid: element.patchcrmid
        })
    })
    return mappedTRAs;
}

export default apiTRAToUiTRA;