export default function ProductCard({ p }: { p: any }) {
    return (
        <a
            href={`/products/${p.slug}`}
            className="border rounded shadow hover:shadow-lg transition p-3 block"
        >
            <img
                src={p.thumbnailUrl}
                className="w-full h-40 object-cover rounded"
            />
            <div className="mt-3">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-primary font-bold">{p.priceFrom}₫</p>
                <p className="text-gray-500 text-sm">{p.brandName}</p>
            </div>
        </a>
    );
}
