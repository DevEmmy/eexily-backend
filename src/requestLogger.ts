import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';

interface LogDetails {
    timestamp: string;
    method: string;
    route: string;
    params: any;
    body: any;
    query: any;
    responseDetails: {
        statusCode: number;
        response: any;
    };
    timeTaken: string;
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
    const startTime = performance.now();
    const originalSend = res.send;

    // Log incoming request
    const requestDetails = {
        timestamp: new Date().toISOString(),
        method: req.method,
        route: req.originalUrl,
        params: req.params,
        body: req.body,
        query: req.query
    };

    // Log outgoing response
    res.send = function (body?: any): Response {
        const endTime = performance.now();
        const timeTaken = (endTime - startTime).toFixed(2);

        const responseDetails = {
            statusCode: res.statusCode,
            response: body
        };

        const logDetails: LogDetails = {
            ...requestDetails,
            responseDetails,
            timeTaken: `${timeTaken}ms`
        };

        // Format log for better readability
        const formattedLog = `
        Timestamp: ${logDetails.timestamp}
        Method: ${logDetails.method}
        Route: ${logDetails.route}
        Params: ${JSON.stringify(logDetails.params, null, 2)}
        Body: ${logDetails.body}
        Query: ${JSON.stringify(logDetails.query, null, 2)}
        Response Status: ${logDetails.responseDetails.statusCode}
        Response: ${logDetails.responseDetails.response}
        Time Taken: ${logDetails.timeTaken}
        -----------------------------------------------------------
        `;

        // Write to file
        const logFilePath = path.join(__dirname, 'logs.txt');
        fs.appendFile(logFilePath, formattedLog, (err) => {
            if (err) {
                console.error("Failed to write log:", err);
            }
        });

        // Send the original response
        return originalSend.call(this, body);
    };

    next();
}
