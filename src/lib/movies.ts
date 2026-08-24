export interface HorrorMovie {
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
): HorrorMovie => {
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

export const horrorMovies: HorrorMovie[] = [
  withPoster(1, "The Conjuring", 2013, "8.1", "Supernatural"),
  withPoster(2, "Hereditary", 2018, "7.3", "Folk Horror"),
  withPoster(3, "It", 2017, "7.3", "Clown"),
  withPoster(4, "The Shining", 1980, "8.4", "Psychological"),
  withPoster(5, "Midsommar", 2019, "7.1", "Folk Horror"),
  withPoster(6, "Get Out", 2017, "7.7", "Thriller"),
  withPoster(7, "A Quiet Place", 2018, "7.5", "Survival"),
  withPoster(8, "Us", 2019, "6.8", "Mystery"),
  withPoster(9, "Sinister", 2012, "6.8", "Found Footage"),
  withPoster(10, "Insidious", 2010, "6.8", "Supernatural"),
  withPoster(11, "The Witch", 2015, "6.8", "Period Horror"),
  withPoster(12, "Annihilation", 2018, "6.8", "Sci-Fi Horror"),
  withPoster(13, "Black Swan", 2010, "8.0", "Psychological"),
  withPoster(14, "Suspiria", 2018, "6.7", "Occult"),
  withPoster(15, "Nope", 2022, "6.8", "Sci-Fi Horror"),
  withPoster(16, "Barbarian", 2022, "7.0", "Thriller"),
  withPoster(17, "Talk To Me", 2022, "7.1", "Supernatural"),
  withPoster(18, "M3GAN", 2022, "6.3", "Tech Horror"),
  withPoster(19, "Pearl", 2022, "6.3", "Slasher"),
  withPoster(20, "Smile", 2022, "6.5", "Psychological"),
];

export const getHorrorMovieById = (id: number) =>
  horrorMovies.find((movie) => movie.id === id);