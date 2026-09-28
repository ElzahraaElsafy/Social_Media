import { NextFunction, Request, Response } from "express";
import { BadRequestExpection } from "../module/common/response/app-exception";
import { ZodType, ZodError } from "zod";

type keyRequestType = keyof Request;
type schemaType = Partial<Record<keyRequestType, ZodType>>;

type IssuesType = {
  key: keyRequestType;
  issues: {
    path: (string | number | symbol)[];
    message: string;
  }[];
};

export const validation = (schema: schemaType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const issues: IssuesType[] = [];

    for (const key of Object.keys(schema) as keyRequestType[]) {
      if (!schema[key]) continue;

      const result = schema[key]?.safeParse(req[key]); // returns flag + error
      console.log({ result });

      if (!result?.success) {
        const errors = result?.error as ZodError;

        issues.push({
          key,
          issues: errors.issues.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        });
      }
    }

    if (issues.length > 0) {
      throw new BadRequestExpection("Invalid API", issues);
    }

    next();
  };
};