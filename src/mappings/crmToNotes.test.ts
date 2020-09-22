import { Note, CrmNote } from '../interfaces/note';
import MockCrmNoteResponse from '../tests/helpers/generateCrmNoteResponse';
import { crmToNotes } from './crmToNotes';
import faker from 'faker';

describe('crmToNotes', () => {
  it('returns valid notes when given a crmResponse', () => {
    const crmResponse = MockCrmNoteResponse();

    const convertedNotes: Note[] = crmToNotes(crmResponse);

    let index = 0;
    convertedNotes.forEach((note) => {
      const crmValue = crmResponse.value[index] as CrmNote;

      expect(note.createdBy).toEqual(
        crmValue[
          'annotation2_x002e_createdby@OData.Community.Display.V1.FormattedValue'
        ]
      );
      expect(note.createdOn).toEqual(crmValue['annotation2_x002e_createdon']);
      expect(note.incidentId).toEqual(crmValue['incident1_x002e_incidentid']);
      expect(note.text).toEqual(crmValue['annotation2_x002e_notetext']);
      index += 1;
    });
  });

  it('returns an empty array when no notes are availabe', () => {
    const crmResponse = {
      '@odata.context': faker.lorem.word(),
      value: [],
    };

    const convertedNotes: Note[] = crmToNotes(crmResponse);

    expect(convertedNotes.length).toEqual(0);
  });
});
