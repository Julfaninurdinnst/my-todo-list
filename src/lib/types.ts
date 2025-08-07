export type Card = {
  id: string;
  title: string;
};
export type List = {
  id: number;
  title: string;
  cards: Card[];
};

export type Board = {
  id: string;
  title: string;
  lists: List[];
};
