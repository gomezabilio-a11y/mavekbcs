/**
 * Tag options for insight creation/editing
 * Combines all industries and solutions into a single list
 */

import { INDUSTRIES, SOLUTION_CATEGORIES } from "./siteData";

export interface TagOption {
  value: string;
  label: string;
  type: "industry" | "solution";
  category?: string;
}

export const getTagOptions = (): TagOption[] => {
  const options: TagOption[] = [];

  // Add all industries
  INDUSTRIES.forEach((industry) => {
    options.push({
      value: industry.slug,
      label: industry.name,
      type: "industry",
    });
  });

  // Add all solutions
  SOLUTION_CATEGORIES.forEach((category) => {
    category.solutions.forEach((solution) => {
      options.push({
        value: solution.slug,
        label: solution.name,
        type: "solution",
        category: category.name,
      });
    });
  });

  return options;
};

export const getTagLabel = (slug: string): string => {
  const options = getTagOptions();
  const option = options.find((opt) => opt.value === slug);
  return option ? option.label : slug;
};

export const getTagType = (slug: string): "industry" | "solution" | null => {
  const options = getTagOptions();
  const option = options.find((opt) => opt.value === slug);
  return option ? option.type : null;
};
