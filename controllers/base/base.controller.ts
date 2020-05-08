import { Server } from 'hapi';

export class Base<T> {
  private readonly endPoint: string;
  private readonly entity: T;
  private readonly server: Server;

  constructor(endPoint: string, entity: T, server: Server) {
    this.endPoint = endPoint;
    this.server = server;
  }

  private initRoutes(): void {}
}
