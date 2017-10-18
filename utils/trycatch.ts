export const trycatch = (errorHandler?: (error: any) => void): any => {
    return (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<any> = {}) => {

        const func = descriptor.value;
        if (typeof descriptor.value === "function") {
            descriptor.value = function(...args: any[]) {
                let res;
                try {
                    res = func.apply(this, args);
                }
                catch (e) {
                    if (typeof errorHandler === "function") {
                        errorHandler(e);
                    } else {
                        console.error(e);
                    }
                }
                return res;
            };
        }

        return descriptor;
    };
};
