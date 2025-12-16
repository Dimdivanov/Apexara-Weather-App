import mongoose, { Document } from 'mongoose';

export interface NewsDataModel {
  status: string;
  totalResults: number;
  articles: Articledata[];
};

export interface Articledata {
  source: Source;
  author: string;
  title: string;
  url: string;
  urlToImage: string;
  publishedAt: Date;
  content: string;
};

export interface Source {
  id: string;
  name: string;
};

const SourceSchema = new mongoose.Schema<Source>({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const ArticlesSchema = new mongoose.Schema<Articledata>({
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  urlToImage: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  source: {
    type: SourceSchema,
    required: true,
  },
});

const NewsDataSchema = new mongoose.Schema<NewsDataModel>({
  status: {
    type: String,
    required: true,
  },
  totalResults: {
    type: Number,
    required: true,
  },
  articles: {
    type: [ArticlesSchema],
    required: true,
  },
});

export const NewsDataSchemaModel = mongoose.model<NewsDataModel>('NewsData', NewsDataSchema, 'news-data');
