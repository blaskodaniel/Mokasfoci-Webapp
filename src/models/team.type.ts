export interface Team {
  _id: string;
  name?: string | null;
  flag?: string | null;
  win?: number | null;
  draw?: number | null;
  loss?: number | null;
  score?: number | null;
  getgoal?: number | null;
  kickgoal?: number | null;
  active?: boolean | null;
}
