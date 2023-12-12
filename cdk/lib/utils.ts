import { APP_NAME } from "./constants";

export function fullName(name: string) {
  return `${APP_NAME}-${name}-dev`;
}