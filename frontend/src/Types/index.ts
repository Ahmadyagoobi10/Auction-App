export type Auction = {
  id: number;
  title: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
};

export type Bid = {
  id: number;
  amount: number;
  createdAt: string;
  auctionId: number;
  userId: number;
};