import { useEffect, type RefObject } from "react";

type Event = MouseEvent | TouchEvent;

/**
 * Egy egyéni hook, amely egy callback függvényt hív meg, ha a felhasználó
 * a megadott ref-en kívülre kattint.
 *
 * @param ref A figyelt elemre mutató RefObject.
 * @param callback A függvény, ami lefut, ha a kattintás kívül történik.
 */
export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  callback: () => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;
      // Ne csináljon semmit, ha a kattintás a ref-en belül vagy annak leszármazottjain történik
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }
      callback();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]); // Újrafuttatja az effektet, ha a ref vagy a callback változik
};
