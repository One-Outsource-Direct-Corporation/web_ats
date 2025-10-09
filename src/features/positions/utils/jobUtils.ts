export const generateJobLink = (title: string) => {
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return `https://oodc.yourcompany.com/jobs/${slug}`;
};

export const getRandomProgress = () => {
  const totalSteps = Math.floor(Math.random() * 5) + 1;
  const completedSteps = Math.floor(Math.random() * (totalSteps + 1));
  return { completed: completedSteps, total: totalSteps };
};
