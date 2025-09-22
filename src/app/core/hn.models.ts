//Type definitions for Hacker News API responses

export type FeedKind = 'top' | 'new' | 'best' | 'ask' | 'show' | 'jobs';

export type HnItemType = 'story' | 'comment' | 'poll' | 'pollopt';

//Interface for the types used for the API values
export interface HnItem {
  
  id: number;
  by?: string;         
  time?: number;        
  title?: string;
  url?: string;
  score?: number;
  descendants?: number; 
  type?: HnItemType;    


  
  deleted?: boolean;
  dead?: boolean;
  text?: string;              
  parent?: number;            
  poll?: number;              
  kids?: number[];            
  parts?: number[]; 
}

export interface HnUser {
  id: string;      
  created: number;  
  karma: number;
  about?: string;
  submitted?: number[];
}