import { FormEvent } from "react";

export default function useSendMessage(
  callback: (e: FormEvent) => Promise<void>
) {
  return callback;
}
