import { TRA } from '../interfaces/tra';

const apiTRAToUiTRA = (tras: any[]): TRA[] => {
    const mappedTRAs: TRA[] = [];

    tras.forEach((element: any) =>{
        mappedTRAs.push({
            id: element.traid,
            name: element.name,
            patchid: element.patchcrmid
        })
    })
    return mappedTRAs;
}

export default apiTRAToUiTRA;