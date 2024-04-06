import Elysia from "elysia";
import * as pc from "picocolors";
import process from "process";

interface Writer {
    write: (message: string) => void;
}

const consoleWriter: Writer = {
    write(message: string) {
        console.log(message);
    },
};

interface Options {
    logIP?: boolean;
    writer?: Writer;
}

export const logger = (options?: Options) => {
    const { write } = options?.writer || consoleWriter;
    return new Elysia({
        name: "logysia",
    })
        .onRequest((ctx) => {
            ctx.store = { ...ctx.store, beforeTime: process.hrtime.bigint() };
        })

        .onBeforeHandle({ as: "global" }, (ctx) => {
            ctx.store = { ...ctx.store, beforeTime: process.hrtime.bigint() };
        })
        .onAfterHandle({ as: "global" }, ({ request, store, set }) => {
            const logStr: string[] = [];
            if (options !== undefined && options.logIP) {
                if (request.headers.get("X-Forwarded-For")) {
                    logStr.push(
                        `[${pc.cyan(request.headers.get("X-Forwarded-For"))}]`
                    );
                }
            }

            logStr.push(methodString(request.method));

            logStr.push(pc.green(set.status));

            logStr.push(new URL(request.url).pathname);
            const beforeTime: bigint = (store as any).beforeTime;

            logStr.push(durationString(beforeTime));

            write(logStr.join(" "));
        })
        .onError({ as: "global" }, ({ request, error, store, set }) => {
            const logStr: string[] = [];

            logStr.push(pc.red(methodString(request.method)));

            logStr.push(pc.red(set.status));

            logStr.push(new URL(request.url).pathname);

            logStr.push(pc.red("Error"));

            if ("status" in error) {
                logStr.push(String(error.status));
            }

            logStr.push(error.message);
            const beforeTime: bigint = (store as any).beforeTime;

            logStr.push(durationString(beforeTime));

            write(logStr.join(" "));
        });
};

function durationString(beforeTime: bigint): string {
    const now = process.hrtime.bigint();
    const timeDifference = now - beforeTime;
    const nanoseconds = Number(timeDifference);

    const durationInMicroseconds = (nanoseconds / 1e3).toFixed(0); // Convert to microseconds
    const durationInMilliseconds = (nanoseconds / 1e6).toFixed(0); // Convert to milliseconds
    let timeMessage: string = "";

    if (nanoseconds >= 1e9) {
        const seconds = (nanoseconds / 1e9).toFixed(2);
        timeMessage = `| ${seconds}s`;
    } else if (nanoseconds >= 1e6) {
        timeMessage = `| ${durationInMilliseconds}ms`;
    } else if (nanoseconds >= 1e3) {
        timeMessage = `| ${durationInMicroseconds}µs`;
    } else {
        timeMessage = `| ${nanoseconds}ns`;
    }

    return timeMessage;
}

function methodString(method: string): string {
    switch (method) {
        case "GET":
            // Handle GET request
            return pc.white("GET");

        case "POST":
            // Handle POST request
            return pc.yellow("POST");

        case "PUT":
            // Handle PUT request
            return pc.blue("PUT");

        case "DELETE":
            // Handle DELETE request
            return pc.red("DELETE");

        case "PATCH":
            // Handle PATCH request
            return pc.green("PATCH");

        case "OPTIONS":
            // Handle OPTIONS request
            return pc.gray("OPTIONS");

        case "HEAD":
            // Handle HEAD request
            return pc.magenta("HEAD");

        default:
            // Handle unknown request method
            return method;
    }
}
