import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CaseStudyTemplate } from "@/components/case-study/case-study-template";
import {
  getCaseStudyBySlug,
  getAllCaseStudySlugs,
} from "@/lib/content/loaders";

interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs();
  return slugs.map(slug => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: `${caseStudy.frontmatter.title} | Case Study`,
    description: `${caseStudy.frontmatter.problem}`,
    openGraph: {
      title: caseStudy.frontmatter.title,
      description: caseStudy.frontmatter.problem,
      type: "article",
      publishedTime: caseStudy.frontmatter.date,
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return <CaseStudyTemplate caseStudy={caseStudy} />;
}
