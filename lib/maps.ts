export type PrintRatio = '2:3' | '3:4';

export type MapSize = {
  id: string;
  label: string;
  price: number;
  ratio: PrintRatio;
};

export type MercatorMap = {
  id: string;
  chapterSlug?: string;
  slug: string;
  title: string;
  year: string;
  description: string;
  image?: string;
  images?: string[];
  printImage?: string;
  printFiles?: Partial<Record<PrintRatio, string>>;
  figure: string;
  sizes?: MapSize[];
};

export const MAPS: MercatorMap[] = [
  {
    id: "1",
    slug: "saxony",
    title: "Lower Saxony & Mecklenburg",
    year: "1569",
    figure: "Figure 1.1: Saxonia Inferior et Meklenborg Dvc",
    image: "/maps/saxonia.jpg",
    images: ["/maps/saxonia.jpg", "/maps/saxonia1.webp", "/maps/saxonia2.jpg", "/maps/saxonia3.jpg", "/maps/saxonia4.avif", "/maps/saxonia5.webp", "/maps/saxonia6.avif", "/maps/saxonia7.avif", "/maps/saxonia8.avif", "/maps/saxonia9.avif", "/maps/saxonia10.webp", "/maps/saxonia11.jpg", "/maps/saxonia12.jpg"],
    printImage: "https://www.dropbox.com/scl/fi/w451se2v09zxwb1vumrr2/plate_01.jpg?rlkey=imoca3u4s6l8q8o8sfscnkwqa&st=2yq5oz4f&dl=1",
    printFiles: {
      '2:3': "https://www.dropbox.com/scl/fi/w451se2v09zxwb1vumrr2/plate_01.jpg?rlkey=imoca3u4s6l8q8o8sfscnkwqa&st=2yq5oz4f&dl=1",
      '3:4': "https://www.dropbox.com/scl/fi/w451se2v09zxwb1vumrr2/plate_01.jpg?rlkey=imoca3u4s6l8q8o8sfscnkwqa&st=2yq5oz4f&dl=1",
    },
    description: "Rare 16th Century Antique Map of Northern Germany: Lower Saxony & Mecklenburg.\n\nJourney back to the Golden Age of cartography with this stunning digital scan of a genuine 17th-century copperplate engraved map.\n\nTHE HISTORICAL CONTEXT: This masterful piece depicts 'Saxonia Inferior et Meklenborg Dvc' — the historical regions of Lower Saxony and the Duchy of Mecklenburg. It shows a fascinating political landscape featuring prominent Hanseatic cities like Hamburg, Bremen, and Lübeck.\n\nAUTHENTIC DETAIL: This is not a modern recreation. It is a high-fidelity digital archive of an original antique atlas plate, capturing intricate copperplate engraving lines and the richly textured, aged paper of the period."
  },
  {
    id: "2",
    slug: "england",
    title: "British Isles",
    year: "1564",
    figure: "Anglia, Scotia et Hibernia",
    image: "/maps/brit0.jpeg",
    images: ["/maps/brit0.jpeg", "/maps/brit1.webp", "/maps/brit2.webp", "/maps/brit3.webp", "/maps/brit4.webp", "/maps/brit5.webp", "/maps/brit6.webp", "/maps/brit7.jpeg", "/maps/brit8.webp", "/maps/brit9.webp", "/maps/brit10.webp", "/maps/brit11.webp", "/maps/brit12.webp", "/maps/brit13.webp"],
    printImage: "https://www.dropbox.com/scl/fi/iszkimst9y1esg9cve8y2/plate_02.jpg?rlkey=k4smsia8warapps2s34q8lv3z&st=y1ugodzu&dl=1",
    printFiles: {
      '2:3': "https://www.dropbox.com/scl/fi/iszkimst9y1esg9cve8y2/plate_02.jpg?rlkey=k4smsia8warapps2s34q8lv3z&st=y1ugodzu&dl=1",
      '3:4': "https://www.dropbox.com/scl/fi/iszkimst9y1esg9cve8y2/plate_02.jpg?rlkey=k4smsia8warapps2s34q8lv3z&st=y1ugodzu&dl=1",
    },
    description: "Rare 16th Century Antique Map of the British Isles: Anglia, Scotia & Hibernia | Museum-Quality Gerard Mercator Scan.\n\nOwn a piece of cartographic history with this stunning print of a genuine 16th-century copperplate engraved map by the legendary Gerard Mercator.\n\nTHE HISTORICAL CONTEXT This masterpiece, titled 'Anglia, Scotia et Hibernia,' depicts the British Isles in exquisite detail. Created by Gerardus Mercator — one of the most influential cartographers of all time — it features England, Scotland, and Ireland with their historical Latin names. The map is signed 'Per Gerardum Mercatorem Cum Privilegio,' indicating its prestigious origin and legal protection at the time of publication.\n\nThe map is adorned with an ornate red and gold Renaissance-style cartouche and showcases historical maritime nomenclature, including the 'Oceanus Germanicus' (North Sea) and 'Oceanus Britannicus' (English Channel).\n\nAUTHENTIC DETAIL This is not a modern recreation. It is a high-fidelity digital archive of an original antique atlas plate. It captures every nuance: the intricate engraving lines, the beautiful original hand-applied watercolor, the central fold line from the historical atlas, and the rich texture of the aged paper.\n\nA sophisticated centerpiece for a home library, executive office, or for anyone with a deep appreciation for British history and classical cartography."
  },
  {
    id: "3",
    slug: "asia",
    title: "Asia",
    year: "1569",
    figure: "Asia",
    image: "/maps/asia0.jpeg",
    images: ["/maps/asia0.jpeg", "/maps/asia1.webp", "/maps/asia2.webp", "/maps/asia3.webp", "/maps/asia4.webp", "/maps/asia5.webp", "/maps/asia6.webp", "/maps/asia7.webp", "/maps/asia8.webp", "/maps/asia9.webp", "/maps/asia10.webp", "/maps/asia11.webp", "/maps/asia12.webp", "/maps/asia13.webp", "/maps/asia14.webp", "/maps/asia15.webp"],
    printImage: "https://www.dropbox.com/scl/fi/r0uwqfdb84mrbp2xem0pp/plate_03.jpg?rlkey=20z61vcho1nmrqcufl1rbjbti&st=zqws835f&dl=1",
    printFiles: {
      '2:3': "https://www.dropbox.com/scl/fi/r0uwqfdb84mrbp2xem0pp/plate_03.jpg?rlkey=20z61vcho1nmrqcufl1rbjbti&st=zqws835f&dl=1",
      '3:4': "https://www.dropbox.com/scl/fi/r0uwqfdb84mrbp2xem0pp/plate_03.jpg?rlkey=20z61vcho1nmrqcufl1rbjbti&st=zqws835f&dl=1",
    },
    description: "Rare 16th Century Antique Map of Asia: Mercator Family Masterpiece | Museum-Quality Historical Scan\n\nExplore the mysteries of the Orient through the eyes of the world's most famous cartographic dynasty. This is a stunning, high-fidelity digital scan of an original 17th-century map of Asia by Gerard Mercator the Younger.\n\nTHE HISTORICAL CONTEXT Based on the monumental geographical works of his grandfather, the legendary Gerard Mercator, this map titled 'ASIA' offers a fascinating glimpse into the world known at the turn of the 16th and 17th centuries. It covers not only the vast Asian continent and the East Indies but also includes early depictions of the Northern American coast (Americae Pars) and the mysterious Southern Land (Australis Pars).\n\nThe map is beautifully illustrated with a majestic sailing ship navigating the Pacific waters, symbolizing the era's adventurous spirit and global trade.\n\nAUTHENTIC DETAIL This is not a modern reproduction. It is a high-fidelity digital archive of an original antique atlas plate. It flawlessly captures the intricate copperplate engraving, original hand-applied watercolor, the central fold line from the historical atlas, and the rich, aged texture of the paper.\n\nA sophisticated addition to any home office, study, or library, perfect for history enthusiasts, world travelers, and lovers of classical cartography."
  }
  /*{
    id: "",
    slug: "",
    title: "",
    year: "",
    figure: "",
    image: "",
    images: [""],
    printImage: "",
    description: ""
  },*/
  // Сюда мы добавим остальные 55 карт со временем
];