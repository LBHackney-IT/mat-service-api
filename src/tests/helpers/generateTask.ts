import {Task, Stage} from "../../interfaces/task";

const MockTask = (): Task => {
  return (
    {
      id: "",
      createdTime: new Date(),
      category: "",
      type: "",
      resident: {
        presentationName: "",
        role: ""
      },
      address: {
        presentationShort: "",
      },
      dueTime: new Date(),
      stage: Stage.started
    }
  )
}

export default MockTask
