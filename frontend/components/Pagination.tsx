export default function Pagination({ page, total }: { page: number; total: number }) {
    return (
        <div className="flex gap-4 mt-8 justify-center">
            {page > 0 && (
                <a
                    href={`?page=${page - 1}`}
                    className="px-4 py-2 bg-gray-200 rounded"
                >
                    ← Trang trước
                </a>
            )}

            {page < total - 1 && (
                <a
                    href={`?page=${page + 1}`}
                    className="px-4 py-2 bg-gray-200 rounded"
                >
                    Trang sau →
                </a>
            )}
        </div>
    );
}
