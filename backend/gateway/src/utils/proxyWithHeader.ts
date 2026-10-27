import proxy from "express-http-proxy";
import { Request, Response } from "express";

export const proxyWithHeader = (url: string) => {
    return proxy(url, {
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            const user = (srcReq as any).user;
            if (user) {
                proxyReqOpts.headers = proxyReqOpts.headers || {};
                proxyReqOpts.headers["x-user-id"] = user.userId || user.id || user._id;
            }
            return proxyReqOpts;
        }
    });
};
