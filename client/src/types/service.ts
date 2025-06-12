// types/service.ts
export interface Service {
  name: string;
  status: "running" | "stopped";
  description?: string;
  pid?: string;
  activeState?: string;
  subState?: string;
}
