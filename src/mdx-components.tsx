import type { MDXComponents } from "mdx/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings
    h1: ({ className, ...props }) => (
      <h1
        className={cn(
          "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-foreground",
          className
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }) => (
      <h2
        className={cn(
          "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-10 mb-4 text-foreground",
          className
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3
        className={cn(
          "scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4 text-foreground",
          className
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }) => (
      <h4
        className={cn(
          "scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-3 text-foreground",
          className
        )}
        {...props}
      />
    ),
    h5: ({ className, ...props }) => (
      <h5
        className={cn(
          "scroll-m-20 text-lg font-semibold tracking-tight mt-4 mb-2 text-foreground",
          className
        )}
        {...props}
      />
    ),
    h6: ({ className, ...props }) => (
      <h6
        className={cn(
          "scroll-m-20 text-base font-semibold tracking-tight mt-4 mb-2 text-foreground",
          className
        )}
        {...props}
      />
    ),

    // Text elements
    p: ({ className, ...props }) => (
      <p
        className={cn(
          "leading-7 text-muted-foreground mb-4 [&:not(:first-child)]:mt-4",
          className
        )}
        {...props}
      />
    ),

    // Lists
    ul: ({ className, ...props }) => (
      <ul
        className={cn(
          "my-6 ml-6 list-disc space-y-2 text-muted-foreground",
          className
        )}
        {...props}
      />
    ),
    ol: ({ className, ...props }) => (
      <ol
        className={cn(
          "my-6 ml-6 list-decimal space-y-2 text-muted-foreground",
          className
        )}
        {...props}
      />
    ),
    li: ({ className, ...props }) => (
      <li className={cn("leading-7", className)} {...props} />
    ),

    // Links
    a: ({ className, ...props }) => (
      <a
        className={cn(
          "font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors",
          className
        )}
        {...props}
      />
    ),

    // Blockquote
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn(
          "mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground bg-muted/50 py-4 rounded-r-lg",
          className
        )}
        {...props}
      />
    ),

    // Code
    code: ({ className, ...props }) => (
      <code
        className={cn(
          "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground",
          className
        )}
        {...props}
      />
    ),
    pre: ({ className, ...props }) => (
      <pre
        className={cn(
          "mb-4 mt-6 overflow-x-auto rounded-lg border bg-black p-4 text-white",
          className
        )}
        {...props}
      />
    ),

    // Table
    table: ({ className, ...props }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table
          className={cn(
            "w-full border-collapse border border-border",
            className
          )}
          {...props}
        />
      </div>
    ),
    thead: ({ className, ...props }) => (
      <thead className={cn("bg-muted/50", className)} {...props} />
    ),
    tbody: ({ className, ...props }) => (
      <tbody className={cn("divide-y divide-border", className)} {...props} />
    ),
    tr: ({ className, ...props }) => (
      <tr
        className={cn(
          "border-b border-border transition-colors hover:bg-muted/50",
          className
        )}
        {...props}
      />
    ),
    th: ({ className, ...props }) => (
      <th
        className={cn(
          "border border-border px-4 py-3 text-left font-bold text-foreground [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }) => (
      <td
        className={cn(
          "border border-border px-4 py-3 text-left text-muted-foreground [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),

    // Images
    img: ({ className, alt, ...props }) => (
      <img
        className={cn("rounded-md border my-6 w-full object-cover", className)}
        alt={alt}
        {...props}
      />
    ),

    // HR
    hr: ({ ...props }) => <Separator className="my-8" {...props} />,

    // Strong and Em
    strong: ({ className, ...props }) => (
      <strong
        className={cn("font-semibold text-foreground", className)}
        {...props}
      />
    ),
    em: ({ className, ...props }) => (
      <em
        className={cn("italic text-muted-foreground", className)}
        {...props}
      />
    ),

    // Custom components que puedes usar en MDX
    Badge: ({ variant = "secondary", ...props }) => (
      <Badge variant={variant} {...props} />
    ),

    Alert: ({ className, ...props }) => (
      <Alert className={cn("my-6", className)} {...props} />
    ),

    AlertDescription: AlertDescription,

    // Callout personalizado
    Callout: ({ type = "info", children, ...props }) => {
      const variants = {
        info: "border-blue-200 bg-blue-50 text-blue-900",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
        error: "border-red-200 bg-red-50 text-red-900",
        success: "border-green-200 bg-green-50 text-green-900",
      };

      return (
        <div
          className={cn(
            "my-6 rounded-lg border p-4",
            variants[type as keyof typeof variants]
          )}
          {...props}
        >
          {children}
        </div>
      );
    },

    ...components,
  };
}
