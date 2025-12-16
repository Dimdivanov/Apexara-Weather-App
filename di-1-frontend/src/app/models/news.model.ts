export interface NewsDataModel {
  status: string,
  totalResults: number,
  articles: Articledata[],
};

export interface Articledata {
  source: Source,
  author: string,
  title: string,
  url: string,
  urlToImage: string,
  publishedAt: Date,
  content: string,
};

export interface Source {
  id: string,
  name: string,
};
