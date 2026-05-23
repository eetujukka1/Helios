import { bulkAddTarget } from "@helios/queue";
import type { Target } from "@helios/shared";

export async function loadTargetsToCache(targets: Target[]): Promise<void> {
  await bulkAddTarget(
    targets.map((target) => ({ id: target.id, value: target })),
  );
}
