export type MapSize = {
  id: string;
  label: string;
  price: number;
};

export type MercatorMap = {
  id: string;
  slug: string;
  title: string;
  year: string;
  description: string;
  image?: string;
  images?: string[];
  printImage: string;
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
    description: "Rare 17th Century Antique Map of Northern Germany: Lower Saxony & Mecklenburg.\n\nJourney back to the Golden Age of cartography with this stunning digital scan of a genuine 17th-century copperplate engraved map.\n\nTHE HISTORICAL CONTEXT: This masterful piece depicts 'Saxonia Inferior et Meklenborg Dvc' — the historical regions of Lower Saxony and the Duchy of Mecklenburg. It shows a fascinating political landscape featuring prominent Hanseatic cities like Hamburg, Bremen, and Lübeck.\n\nAUTHENTIC DETAIL: This is not a modern recreation. It is a high-fidelity digital archive of an original antique atlas plate, capturing intricate copperplate engraving lines and the richly textured, aged paper of the period."
  },
  /*{
    id: "2",
    slug: "europe-1554",
    title: "Map of Europe, 1554",
    year: "1554",
    figure: "Figure 2.1: Europam Descriptio",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/25/Mercator_Europe_1554.jpg",
    images: ["https://upload.wikimedia.org/wikipedia/commons/2/25/Mercator_Europe_1554.jpg"],
    description: "Mercator's 1554 map of Europe was a milestone in cartography, significantly improving the accuracy of the continent's shape compared to Ptolemaic models."
  },*/
  // Сюда мы добавим остальные 55 карт со временем
];