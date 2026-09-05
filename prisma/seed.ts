import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const companies = [
  {
    slug: "openai",
    name: "OpenAI",
    description:
      "AI research and deployment company building advanced artificial intelligence systems and products.",
    website: "https://openai.com",
    industry: "AI Research",
    location: "San Francisco",
    country: "USA",
    foundedYear: 2015,
    employees: "1000+",
    funding: "$11B+",
    stage: "Private",
    featured: true,
  },
  {
    slug: "anthropic",
    name: "Anthropic",
    description:
      "AI safety and research company developing reliable, interpretable, and steerable AI systems.",
    website: "https://anthropic.com",
    industry: "AI Research",
    location: "San Francisco",
    country: "USA",
    foundedYear: 2021,
    employees: "1000+",
    funding: "$7B+",
    stage: "Private",
    featured: true,
  },
  {
    slug: "google-deepmind",
    name: "Google DeepMind",
    description:
      "AI research laboratory focused on solving intelligence and applying AI to major scientific and real-world challenges.",
    website: "https://deepmind.google",
    industry: "AI Research",
    location: "London",
    country: "UK",
    foundedYear: 2010,
    employees: "5000+",
    funding: "Alphabet",
    stage: "Subsidiary",
    featured: true,
  },
  {
    slug: "mistral-ai",
    name: "Mistral AI",
    description:
      "European AI company developing efficient and open-weight foundation models.",
    website: "https://mistral.ai",
    industry: "Foundation Models",
    location: "Paris",
    country: "France",
    foundedYear: 2023,
    employees: "100-500",
    funding: "$1B+",
    stage: "Private",
    featured: true,
  },
  {
    slug: "cohere",
    name: "Cohere",
    description:
      "Enterprise AI company building language models and AI solutions for businesses.",
    website: "https://cohere.com",
    industry: "Enterprise AI",
    location: "Toronto",
    country: "Canada",
    foundedYear: 2019,
    employees: "500-1000",
    funding: "$900M+",
    stage: "Private",
    featured: false,
  },
  {
    slug: "xai",
    name: "xAI",
    description:
      "AI company focused on building advanced reasoning and general-purpose artificial intelligence.",
    website: "https://x.ai",
    industry: "AI Research",
    location: "Palo Alto",
    country: "USA",
    foundedYear: 2023,
    employees: "500-1000",
    funding: "$10B+",
    stage: "Private",
    featured: true,
  },
  {
    slug: "hugging-face",
    name: "Hugging Face",
    description:
      "AI platform and community providing models, datasets, tools, and infrastructure for machine learning.",
    website: "https://huggingface.co",
    industry: "AI Infrastructure",
    location: "New York",
    country: "USA",
    foundedYear: 2016,
    employees: "500-1000",
    funding: "$400M+",
    stage: "Private",
    featured: false,
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    description:
      "AI-powered search and answer engine combining web search with generative AI.",
    website: "https://perplexity.ai",
    industry: "AI Search",
    location: "San Francisco",
    country: "USA",
    foundedYear: 2022,
    employees: "100-500",
    funding: "$500M+",
    stage: "Private",
    featured: true,
  },
  {
    slug: "stability-ai",
    name: "Stability AI",
    description:
      "AI company developing generative models for images, video, audio, and 3D content.",
    website: "https://stability.ai",
    industry: "Generative AI",
    location: "London",
    country: "UK",
    foundedYear: 2020,
    employees: "100-500",
    funding: "$300M+",
    stage: "Private",
    featured: false,
  },
  {
    slug: "runway",
    name: "Runway",
    description:
      "Generative AI company creating tools for video generation and creative production.",
    website: "https://runwayml.com",
    industry: "Generative AI",
    location: "New York",
    country: "USA",
    foundedYear: 2018,
    employees: "100-500",
    funding: "$500M+",
    stage: "Private",
    featured: false,
  },
  {
    slug: "scale-ai",
    name: "Scale AI",
    description:
      "AI data and infrastructure company providing high-quality training data and AI development platforms.",
    website: "https://scale.com",
    industry: "AI Infrastructure",
    location: "San Francisco",
    country: "USA",
    foundedYear: 2016,
    employees: "1000+",
    funding: "$1B+",
    stage: "Private",
    featured: false,
  },
  {
    slug: "figure-ai",
    name: "Figure AI",
    description:
      "Robotics company developing humanoid robots powered by artificial intelligence.",
    website: "https://figure.ai",
    industry: "Robotics",
    location: "Sunnyvale",
    country: "USA",
    foundedYear: 2022,
    employees: "100-500",
    funding: "$1B+",
    stage: "Private",
    featured: false,
  },
];

async function main() {
  await prisma.company.deleteMany();

  await prisma.company.createMany({
    data: companies,
  });

  console.log(`Seeded ${companies.length} companies`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });