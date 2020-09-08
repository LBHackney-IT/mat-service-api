export interface TRAdetails {
  tras: TRA[];
  officername: string;
  patchname: string;
}

export interface TRA {
  id: number;
  name: string;
  patchid: string;
}
