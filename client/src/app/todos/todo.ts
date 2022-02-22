export interface Todo {
  _id: string; // no filter
  owner: string; // local filter
  status: boolean; // server filter
  body: string; // local filter
  category: string; // server filter
}
