import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Shows a set of generated pairs before they're published. Lets the
// admin swap the second member between two 2-person pairs (trios are
// left alone since a 3-way swap isn't well-defined here).
export default function PairingPreviewList({ pairs, onSwap }) {
  const [swapTarget, setSwapTarget] = useState({});

  const handleSwap = (index) => {
    const targetIndex = Number(swapTarget[index]);
    if (Number.isNaN(targetIndex) || targetIndex === index) return;
    onSwap(index, targetIndex);
    setSwapTarget((current) => ({ ...current, [index]: '' }));
  };

  return (
    <div className="space-y-3">
      {pairs.map((pair, index) => (
        <div
          key={pair.id}
          className="flex items-center justify-between border border-border rounded-md px-4 py-3"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground w-16">Pair {index + 1}</span>
            {pair.members.map((member) => (
              <span
                key={member}
                className="text-sm font-medium text-foreground bg-muted px-2.5 py-1 rounded-full"
              >
                {member}
              </span>
            ))}
          </div>

          {pair.members.length === 2 && (
            <div className="flex items-center gap-2">
              <select
                value={swapTarget[index] ?? ''}
                onChange={(e) =>
                  setSwapTarget((current) => ({ ...current, [index]: e.target.value }))
                }
                className="text-xs px-2 py-1.5 rounded-md border border-border text-muted-foreground"
              >
                <option value="">Swap with...</option>
                {pairs
                  .map((p, i) => ({ p, i }))
                  .filter(({ p, i }) => i !== index && p.members.length === 2)
                  .map(({ i }) => (
                    <option key={i} value={i}>
                      Pair {i + 1}
                    </option>
                  ))}
              </select>
              <Button
                variant="secondary"
                className="text-xs px-3 py-1.5 h-auto"
                disabled={!swapTarget[index]}
                onClick={() => handleSwap(index)}
              >
                Swap
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
