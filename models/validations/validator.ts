import { Submission } from "@conform-to/react";
import { FormContext } from "./soldier-validators";

export abstract class Validator<T> {

    protected readonly t?: (key: string) => string;
    protected readonly context: FormContext;

    constructor(context: FormContext, t?: (key: string) => string) {
        this.context = context;
        this.t = t;
    }

    abstract validate(data: FormData): Submission<T>;
}