import {Task, Stage} from "../../interfaces/task";
import faker from "faker";

const MockTask = (): Task => {
  return (
    {
      id: faker.lorem.word(),
      createdTime: faker.date.recent(),
      category: faker.lorem.word(),
      type: faker.lorem.word(),
      resident: {
        presentationName: faker.name.findName(),
        role: faker.lorem.word()
      },
      address: {
        presentationShort: faker.address.streetAddress(),
      },
      dueTime: faker.date.future(),
      stage: Stage.started
    }
  )
}

export default MockTask
