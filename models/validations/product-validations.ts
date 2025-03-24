export interface ProductCreationValidation {
    reference: string; 
    name: string; 
    description: string; 
    price: number; 
    image: File;
}

export interface ProductUpdateValidation {
    reference: string; 
    name: string; 
    description: string; 
    price: number; 
    image?: File;
}