import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileX } from "lucide-react";

export default function CaseStudyNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <FileX className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Case Study Not Found</h1>
            <p className="text-muted-foreground">
              The case study you&apos;re looking for doesn&apos;t exist or has
              been moved.
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/#projects">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </Link>

            <div>
              <Link href="/projects">
                <Button variant="outline">View All Projects</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
