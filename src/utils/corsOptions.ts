export const corsOptions = {
  origin: [] as string[],
};

if (process.env.NODE_ENV === "dev") {
  corsOptions.origin.push("http://localhost:3000");
}
