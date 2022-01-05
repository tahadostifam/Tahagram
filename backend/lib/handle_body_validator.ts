import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export default function validate_body(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
