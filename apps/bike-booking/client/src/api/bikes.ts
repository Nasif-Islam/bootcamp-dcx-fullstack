import { request } from "./client";
import type { Bike, BikeListItem, AvailabilityResponse } from "./types";

export function getBikes(): Promise<BikeListItem[]> {
  return request<BikeListItem[]>("/bikes");
}

export function getBike(id: string): Promise<Bike> {
  return request<Bike>(`/bikes/${id}`);
}

export function getBikeAvailability(
  bikeId: string,
  startTime: string,
  endTime: string,
): Promise<AvailabilityResponse> {
  const params = new URLSearchParams({ startTime, endTime });
  return request<AvailabilityResponse>(
    `/bikes/${bikeId}/availability?${params.toString()}`,
  );
}
