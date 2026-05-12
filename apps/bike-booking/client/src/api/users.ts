import { request } from "./client";
import type { User } from "./types";

export async function register(input: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const user = await request<User>("/users/register", {
    method: "POST",
    body: JSON.stringify(input),
  });

  localStorage.setItem("bb_user_id", user.id);
  return user;
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<User> {
  const user = await request<User>("/users/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  localStorage.setItem("bb_user_id", user.id);
  return user;
}

export function getUser(id: string): Promise<User> {
  return request<User>(`/users/${id}`);
}
