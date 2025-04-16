import { del, put } from "@vercel/blob";
import { FileStorage } from "@/models/storage/file-storage";

export class VercelFileStorage implements FileStorage {

    constructor() {
        if (!process.env.VERCEL_BLOB_FOLDER) {
            throw new Error("VERCEL_BLOB_FOLDER is not defined");
        }
    }

    async store(data: File): Promise<string> {
        const { url } = await put(`${process.env.VERCEL_BLOB_FOLDER}/${data.name}`, data, {
            access: 'public',
        });
        return url;
    }

    async delete(url: string): Promise<void> {
        try {
            await del(url);
            console.log(`Blob at ${url} deleted successfully.`);
        } catch (error) {
            console.error('Error deleting blob:', error);
        }
    }
}