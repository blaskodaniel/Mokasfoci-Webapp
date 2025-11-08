import { useState, useEffect } from "react";

/**
 * Megbízhatóan ellenőrzi, hogy a böngésző mobil nézetben van-e.
 * Egyéni breakpoint-ot is megadhat (alapértelmezett: 768px).
 *
 * @param {number} breakpoint - A képernyő szélessége, ami alatt mobilnak számít (px).
 * @returns {boolean} - Igaz, ha mobilnézet.
 */
const useIsMobile = (breakpoint = 768) => {
  // Inicializáljuk az állapotot a szerver oldali renderelés (SSR) és az első kliens oldali renderelés miatt
  // Alapértelmezésként false, majd az useEffect futásakor frissül.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // A CSS media query-nek megfelelő string létrehozása
    const query = `(max-width: ${breakpoint}px)`;

    // Media Query List létrehozása
    const mediaQueryList = window.matchMedia(query);

    // Kezelő függvény a változásokra
    const documentChangeHandler = (event: MediaQueryListEvent) => {
      // Az állapot frissítése a query aktuális egyezésével
      setIsMobile(event.matches);
    };

    // Kezdő érték beállítása
    setIsMobile(mediaQueryList.matches);

    // Eseményfigyelő hozzáadása
    // Ha a képernyő mérete megváltozik (pl. elforgatás, ablak átméretezés)
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", documentChangeHandler);
    } else {
      // Visszafelé kompatibilitás régebbi böngészőkkel
      mediaQueryList.addListener(documentChangeHandler);
    }

    // Tisztító függvény a leiratkozáshoz
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", documentChangeHandler);
      } else {
        mediaQueryList.removeListener(documentChangeHandler);
      }
    };
  }, [breakpoint]); // Függőségként a breakpoint-ot is megadjuk

  return isMobile;
};

export default useIsMobile;
