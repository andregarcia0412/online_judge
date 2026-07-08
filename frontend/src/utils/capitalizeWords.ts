export const capitalizeWords = (status: string) => {
  const words = status.split(" ");
  return words.map((word) => word[0].toUpperCase() + word.substring(1) + " ");
};
