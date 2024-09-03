import { Router, Request, Response, NextFunction } from 'express';
import { verifyAuth } from '../middleware/verifyAuth';

class BaseRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    // This method should be overridden by child classes
    protected initializeRoutes(): void {
        throw new Error('Method not implemented.');
    }

    // Common error handler middleware
    protected handleErrors(err: Error, req: Request, res: Response, next: NextFunction) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }

    // A utility method to send responses (optional)
    protected sendResponse(res: Response, data: any, statusCode: number = 200) {
        res.status(statusCode).json(data);
    }
}

export default BaseRouter;
