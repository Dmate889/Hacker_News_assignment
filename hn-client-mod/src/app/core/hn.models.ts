export type FeedKind = 'top' | 'new';

export type HnItemType = 'story' | 'comment' | 'job' | 'poll' | 'pollopt';

export interface HnItem {
  id: number;
  by?: string;         //author 
  time?: number;        //Timestamp (in sec)
  title?: string;
  url?: string;
  score?: number;
  descendants?: number;  //number of comments
  type?: HnItemType;    //story, job, etc..
}
