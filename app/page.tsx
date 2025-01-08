"use client";

import { useState } from "react";
import { analyzeHtml } from "./actions/analyze";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  Grid2X2,
  ImageIcon,
  LayoutTemplate,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type AnalysisResult = {
  success: boolean;
  cpElements?: Array<{
    tag: string;
    classes: string[]; // Changed to string[]
    id?: string;
  }>;
  dataScrollElements?: Array<{
    tag: string;
    classes: string[]; // Changed to string[]
    id?: string;
    dataScroll?: string;
  }>;
  emptyAltImgs?: Array<{
    tag: string;
    src: string;
    classes: string[]; // Changed to string[]
    id?: string;
  }>;
  cdpGridElements?: Array<{
    tag: string;
    classes: string[]; // Changed to string[]
    id?: string;
  }>;
  brandpageElements?: Array<{
    tag: string;
    classes: string[]; // Changed to string[]
    id?: string;
  }>;
  error?: string;
};

export default function HtmlChecker() {
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      const analysis = await analyzeHtml(formData);
      setResult(analysis);
    } catch (error) {
      setResult({
        success: false,
        error: "Failed to analyze HTML",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className='container max-w-3xl py-10 space-y-8'>
      <Card>
        <CardHeader>
          <CardTitle>HTML Class & Attribute Checker</CardTitle>
          <CardDescription>
            Enter a URL to check for elements with &apos;cp&apos;,
            &apos;cdp_grid&apos;, &apos;brandpage&apos; classes,
            &apos;data-scroll&apos; attribute, and images with empty alt
            attributes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className='flex gap-4'>
            <Input
              type='url'
              name='url'
              placeholder='https://example.com'
              required
              className='flex-1'
            />
            <Button type='submit' disabled={isPending}>
              {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Analyze
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className='space-y-6'>
          {!result.success ? (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{result.error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-500' />
                    Elements with &apos;cp&apos; class
                  </CardTitle>
                  <CardDescription>
                    Found {result.cpElements?.length ?? 0} elements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result.cpElements?.length ? (
                    <div className='space-y-4'>
                      {result.cpElements.map((element, index) => (
                        <div
                          key={index}
                          className='p-4 rounded-lg border bg-muted/50'
                        >
                          <code className='text-sm'>
                            <span className='text-blue-500'>
                              &lt;{element.tag}
                            </span>
                            {element.id && (
                              <span className='text-purple-500'>
                                {" "}
                                id=&quot;{element.id}&quot;
                              </span>
                            )}
                            <span className='text-green-500'>
                              {" "}
                              class=&quot;{element.classes}&quot;
                            </span>
                            <span className='text-blue-500'>&gt;</span>
                          </code>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-muted-foreground'>
                      No elements found with &apos;cp&apos; class
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <LayoutTemplate className='h-5 w-5 text-purple-500' />
                    Elements with &apos;brandpage&apos; class
                  </CardTitle>
                  <CardDescription>
                    Found {result.brandpageElements?.length ?? 0} elements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result.brandpageElements?.length ? (
                    <div className='space-y-4'>
                      {result.brandpageElements.map((element, index) => (
                        <div
                          key={index}
                          className='p-4 rounded-lg border bg-muted/50'
                        >
                          <code className='text-sm'>
                            <span className='text-blue-500'>
                              &lt;{element.tag}
                            </span>
                            {element.id && (
                              <span className='text-purple-500'>
                                {" "}
                                id=&quot;{element.id}&quot;
                              </span>
                            )}
                            <span className='text-green-500'>
                              {" "}
                              class=&quot;{element.classes}&quot;
                            </span>
                            <span className='text-blue-500'>&gt;</span>
                          </code>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-muted-foreground'>
                      No elements found with &apos;brandpage&apos; class
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Grid2X2 className='h-5 w-5 text-blue-500' />
                    Elements with &apos;cdp_grid&apos; class
                  </CardTitle>
                  <CardDescription>
                    Found {result.cdpGridElements?.length ?? 0} elements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result.cdpGridElements?.length ? (
                    <div className='space-y-4'>
                      {result.cdpGridElements.map((element, index) => (
                        <div
                          key={index}
                          className='p-4 rounded-lg border bg-muted/50'
                        >
                          <code className='text-sm'>
                            <span className='text-blue-500'>
                              &lt;{element.tag}
                            </span>
                            {element.id && (
                              <span className='text-purple-500'>
                                {" "}
                                id=&quot;{element.id}&quot;
                              </span>
                            )}
                            <span className='text-green-500'>
                              {" "}
                              class=&quot;{element.classes}&quot;
                            </span>
                            <span className='text-blue-500'>&gt;</span>
                          </code>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-muted-foreground'>
                      No elements found with &apos;cdp_grid&apos; class
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-500' />
                    Elements with &apos;data-scroll&apos; attribute
                  </CardTitle>
                  <CardDescription>
                    Found {result.dataScrollElements?.length ?? 0} elements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result.dataScrollElements?.length ? (
                    <div className='space-y-4'>
                      {result.dataScrollElements.map((element, index) => (
                        <div
                          key={index}
                          className='p-4 rounded-lg border bg-muted/50'
                        >
                          <code className='text-sm'>
                            <span className='text-blue-500'>
                              &lt;{element.tag}
                            </span>
                            {element.id && (
                              <span className='text-purple-500'>
                                {" "}
                                id=&quot;{element.id}&quot;
                              </span>
                            )}
                            {element.classes && (
                              <span className='text-green-500'>
                                {" "}
                                class=&quot;{element.classes}&quot;
                              </span>
                            )}
                            <span className='text-orange-500'>
                              {" "}
                              data-scroll=&quot;{element.dataScroll}&quot;
                            </span>
                            <span className='text-blue-500'>&gt;</span>
                          </code>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-muted-foreground'>
                      No elements found with &apos;data-scroll&apos; attribute
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <ImageIcon className='h-5 w-5 text-yellow-500' />
                    Images with Empty Alt Attributes
                  </CardTitle>
                  <CardDescription>
                    Found {result.emptyAltImgs?.length ?? 0} images with missing
                    or empty alt text
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result.emptyAltImgs?.length ? (
                    <div className='space-y-4'>
                      {result.emptyAltImgs.map((element, index) => (
                        <div
                          key={index}
                          className='p-4 rounded-lg border bg-muted/50'
                        >
                          <code className='text-sm'>
                            <span className='text-blue-500'>&lt;img</span>
                            {element.id && (
                              <span className='text-purple-500'>
                                {" "}
                                id=&quot;{element.id}&quot;
                              </span>
                            )}
                            {element.classes && (
                              <span className='text-green-500'>
                                {" "}
                                class=&quot;{element.classes}&quot;
                              </span>
                            )}
                            <span className='text-red-500'>
                              {" "}
                              src=&quot;{element.src}&quot;
                            </span>
                            <span className='text-yellow-500'>
                              {" "}
                              alt=&quot;&quot;
                            </span>
                            <span className='text-blue-500'>&gt;</span>
                          </code>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-muted-foreground'>
                      No images found with empty alt attributes
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
}
