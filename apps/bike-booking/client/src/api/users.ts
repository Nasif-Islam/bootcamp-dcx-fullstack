import { request } from "./client";
import type { LoginInput, RegisterInput, User } from "./types";

export async function register(input: RegisterInput): Promise<User> {
  const user = await request<User>("/users/register", {
    method: "POST",
    body: JSON.stringify(input),
  });

  localStorage.setItem("bb_user_id", user.id);
  return user;
}

export async function login(input: LoginInput): Promise<User> {
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
