export interface Parser<T> {
    parse(data: FormData): T;
}