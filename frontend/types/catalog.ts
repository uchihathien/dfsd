export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // current page index
}

export type BrandDto = { id: number; name: string; slug: string };
export type CategoryNodeDto = { id: number; name: string; slug: string; children: CategoryNodeDto[] };

export type ProductListItemDto = {
    id: number; name: string; slug: string;
    thumbnailUrl?: string | null;
    brandName?: string | null;
    priceFrom: number;
};

export type VariantDto = {
    id: number; sku: string; material?: string | null; sizeText?: string | null;
    weightKg?: number | null; price: number; stockQty: number; isDefault: boolean;
};

export type ImageDto = { id: number; url: string; sortOrder: number };

export type ProductDetailDto = {
    id: number; name: string; slug: string; description?: string | null;
    brandName?: string | null; categoryName?: string | null;
    thumbnailUrl?: string | null; datasheetUrl?: string | null;
    images: ImageDto[]; variants: VariantDto[];
};
