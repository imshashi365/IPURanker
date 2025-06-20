import { getNews } from "@/lib/news-utils";
import NewsGrid from "./news-grid";

interface NewsCategoryGridProps {
    category: string;
}

export default async function NewsCategoryGrid({ category }: NewsCategoryGridProps) {
    const news = await getNews({ category });
    return <NewsGrid news={news} />;
}
