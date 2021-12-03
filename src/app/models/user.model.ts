export type User = {
  username: string;
  userId: string;
  roomId: string;
  connected: boolean;
  owner: boolean;
};

export type NewUser = {
  id: string;
  name: string;
  avatar: string;
};
