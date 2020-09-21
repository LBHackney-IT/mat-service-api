import { CrmResponse } from '../gateways/crmGateway';
import { ApiNote, CrmNote } from '../interfaces/note';

export const crmToNotes = (data: CrmResponse) => {
  const notes: ApiNote[] = [];
  if (Array.isArray(data.value)) {
    data.value.forEach((note) => {
      const crmNote = note as CrmNote;
      notes.push(crmToNote(crmNote));
    });
  }

  return notes;
};

const crmToNote = (note: CrmNote): ApiNote => {
  return {
    text: note['annotation2_x002e_notetext'],
    createdOn: note['annotation2_x002e_createdon'],
    createdBy:
      note[
        'annotation2_x002e_createdby@OData.Community.Display.V1.FormattedValue'
      ],
    incidentId: note['incident1_x002e_incidentid'],
  };
};
