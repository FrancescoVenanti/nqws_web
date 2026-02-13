import Header from "@/components/Header";
import NewsFeed from "@/components/NewsFeed";
import Footer from "@/components/Footer";
import { fetchNews, Language } from "@/lib/api";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Home(props: {
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams;
  const lang = (searchParams.lang as Language) || "en";
  const news = await fetchNews(lang);

  return (
    <>
      <Header lang={lang} />
      <NewsFeed news={news} />
      <Footer />
    </>
  );
}
