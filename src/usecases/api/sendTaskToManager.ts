import { v1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';

interface SendTaskToManagerResponse {
  body: any | undefined;
  error: number | undefined;
}

interface SendTaskToManagerOptions {
  gateway: any;
}

interface SendTaskToManagerInterface {
  execute(taskId: string): Promise<SendTaskToManagerResponse>;
}

class SendTaskToManagerUseCase implements SendTaskToManagerInterface {
  gateway: v1MatAPIGatewayInterface;

  constructor(options: SendTaskToManagerOptions) {
    this.gateway = options.gateway;
  }

  public async execute(taskId: string): Promise<SendTaskToManagerResponse> {
    return {
      body: true,
      error: undefined,
    };
  }
}

export default SendTaskToManagerUseCase;
