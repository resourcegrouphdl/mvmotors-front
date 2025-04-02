import { Interface } from "node:readline";

export interface SlidesModel {
    id?:string,
    imageUrl: string;
    author: string;
    title: string;
    dtopic: string;
    description: string;
    shortDescription: string;
    
}

export interface CarrucelModel {
    id?:string,
    inicio: string;
}
