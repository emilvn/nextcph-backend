import type {Application, RequestHandler} from 'express';
import type Controller from './controllers/Controller';

export default class Server{
  private app: Application;
  private readonly port: number;

  constructor(app:Application, port: number) {
    this.port = port;
    this.app = app;
  }

  public run(): void {
    this.app.listen(this.port, () => {
      console.log(`Server started on port http://localhost:${this.port}`);
    });
  }

  public loadMiddleware(middlewares: RequestHandler[]): void {
    middlewares.forEach((middleware) => {
        this.app.use(middleware);
    });
  }

    public loadControllers(controllers:Controller[]): void {
        controllers.forEach((controller) => {
            this.app.use(controller.path, controller.router);
        });
    }
}