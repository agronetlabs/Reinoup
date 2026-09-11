import type { ChestReward } from './economy';

export function scheduleChestOpening(
  open: () => ChestReward | null,
  reveal: (reward: ChestReward | null) => void,
  celebrate: () => void,
  coin: () => void,
): () => void {
  let coinTimer: ReturnType<typeof setTimeout> | undefined;
  // Claim only when the reveal is still mounted, including after StrictMode's cleanup.
  const revealTimer = setTimeout(() => {
    const reward = open();
    reveal(reward);
    if (reward) {
      celebrate();
      coinTimer = setTimeout(coin, 350);
    }
  }, 900);
  return () => {
    clearTimeout(revealTimer);
    clearTimeout(coinTimer);
  };
}
