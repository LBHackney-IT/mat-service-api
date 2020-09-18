interface GetTaskProcessUrlResponse {
  body?: string;
  error?: string;
}

interface GetTaskProcessUrlOptions {
  encryptionKey: string;
}

interface GetTaskProcessUrlInterface {
  execute(taskId: string): Promise<GetTaskProcessUrlResponse>;
}

class GetTaskProcessUrlUseCase implements GetTaskProcessUrlInterface {
  encryptionKey: string;

  constructor(options: GetTaskProcessUrlOptions) {
    this.encryptionKey = options.encryptionKey;
  }

  public async execute(taskId: string): Promise<GetTaskProcessUrlResponse> {
    return { body: `http://foo.com/${taskId}` };
  }
}

export default GetTaskProcessUrlUseCase;
