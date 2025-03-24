export interface FileStorage {
    store(data: File): Promise<string>;
    delete(url: string): Promise<void>;
}