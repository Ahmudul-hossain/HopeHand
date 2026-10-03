export const log = (req, res, next) => {
    console.log(`current url: ${req.url}; Method: ${req.method}`);
    next();
};