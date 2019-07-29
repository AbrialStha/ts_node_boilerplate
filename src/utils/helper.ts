/**
 * Normalize a port into a number, string, or false.
 */

export const normalizePort = (val: any) => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

/**
 * isEmpty function to check if any string, number or object is empty or not, basically any types
 */

export const isEmpty = (value: any) =>
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0);