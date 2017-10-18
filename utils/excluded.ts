import noob from "_utils/noob";

export const onlyBrowser = (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): any => {
    return {
        ...descriptor,
        value: function deprecationWrapper() {
            return process.env.BROWSER ? descriptor.value.apply(this, arguments) : noob;
        },
    };
};

// export const onlyProduction = (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): any => {
//     return {
//         ...descriptor,
//         value: function deprecationWrapper() {
//             return process.env.NODE_ENV ? descriptor.value.apply(this, arguments) : noob;
//         },
//     };
// };
