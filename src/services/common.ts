import Elysia, { StatusMap } from "elysia";

class Service {
    success<T>(
        data: T | null = null,
        code: number | keyof StatusMap = 200,
        message: string = "success"
    ) {
        return {
            code,
            message,
            data,
        };
    }

    error(error: Error | string, code: number | keyof StatusMap = 500) {
        return {
            code,
            message: error instanceof Error ? error.message : error,
            data: null,
        };
    }
}

const CommonService = new Elysia({ name: "Service.Common" }).decorate({
    commonService: new Service(),
});

export { CommonService };
