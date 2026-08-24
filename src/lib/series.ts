export interface HorrorSeries {
  id: number;
  title: string;
  year: number;
  rating: string;
  genre: string;
  poster: string;
}

const POSTER_FILES = [
  "OIP.webp",
  "OIP (3).webp",
  "OIP (2).webp",
  "OIP (1).webp",
  "maxresdefault.jpg",
  "maxresdefault (2).jpg",
  "maxresdefault (1).jpg",
  "image-w1280.webp",
  "download.webp",
  "download (1).webp",
  "chilling-mist-haunting-portrait-ghost-girl-dark-bedroom_899449-309039.avif",
  "360_F_907242810_uHyUrnqgrlO3vI6JukRimtV3jwlm0kVe.jpg",
  "27673f23e982c8c25ae11968be7c995b.jpg",
  "1481526.jpg",
];

const withPoster = (
  id: number,
  title: string,
  year: number,
  rating: string,
  genre: string,
): HorrorSeries => {
  const file = POSTER_FILES[(id - 1) % POSTER_FILES.length];
  return {
    id,
    title,
    year,
    rating,
    genre,
    poster: `/images/${encodeURIComponent(file)}`,
  };
};

export const horrorSeries: HorrorSeries[] = [
  withPoster(1, "The Haunting of Hill House", 2018, "8.6", "Supernatural"),
  withPoster(2, "Midnight Mass", 2021, "7.7", "Religious Horror"),
  withPoster(3, "Marianne", 2019, "7.4", "Occult"),
  withPoster(4, "Bates Motel", 2013, "8.1", "Psychological"),
  withPoster(5, "Archive 81", 2022, "7.3", "Found Footage"),
  withPoster(6, "All of Us Are Dead", 2022, "7.5", "Zombie"),
  withPoster(7, "From", 2022, "7.8", "Mystery"),
  withPoster(8, "Kingdom", 2019, "8.3", "Period Horror"),
  withPoster(9, "American Horror Story", 2011, "8.0", "Anthology"),
  withPoster(10, "Penny Dreadful", 2014, "8.2", "Gothic"),
  withPoster(11, "The Walking Dead", 2010, "8.1", "Survival"),
  withPoster(12, "Stranger Things", 2016, "8.7", "Sci-Fi Horror"),
];

export const getHorrorSeriesById = (id: number) =>
  horrorSeries.find((series) => series.id === id);
