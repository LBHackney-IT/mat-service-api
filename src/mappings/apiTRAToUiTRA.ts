import { TRA } from '../interfaces/tra';

export interface TRAPatchMappingResponseInterface{
    name: string,
    traid: number,
    patchcrmid: string
}

const apiTRAToUiTRA = (tras: TRAPatchMappingResponseInterface[]): TRA[] => {
    const mappedTRAs: TRA[] = [];

    tras.forEach((element: TRAPatchMappingResponseInterface) =>{
        mappedTRAs.push({
            id: element.traid,
            name: element.name,
            patchid: element.patchcrmid
        })
    })
    return mappedTRAs;
}

export default apiTRAToUiTRA;