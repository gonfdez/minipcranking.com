import type { MDXComponents } from "mdx/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings - Using exact shadcn typography styles
    h1: ({ className, ...props }) => (
      <h1
        className={cn(
          "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
          className
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }) => (
      <h2
        className={cn(
          "mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
          className
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3
        className={cn(
          "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
          className
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }) => (
      <h4
        className={cn(
          "scroll-m-20 text-xl font-semibold tracking-tight",
          className
        )}
        {...props}
      />
    ),
    h5: ({ className, ...props }) => (
      <h5
        className={cn(
          "scroll-m-20 text-lg font-semibold tracking-tight",
          className
        )}
        {...props}
      />
    ),
    h6: ({ className, ...props }) => (
      <h6
        className={cn(
          "scroll-m-20 text-base font-semibold tracking-tight",
          className
        )}
        {...props}
      />
    ),

    // Paragraphs - Using shadcn typography style
    p: ({ className, ...props }) => (
      <p
        className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
        {...props}
      />
    ),

    // Lists - Using shadcn typography styles
    ul: ({ className, ...props }) => (
      <ul
        className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
        {...props}
      />
    ),
    ol: ({ className, ...props }) => (
      <ol
        className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)}
        {...props}
      />
    ),
    li: ({ className, ...props }) => (
      <li className={cn("", className)} {...props} />
    ),

    // Links - Using shadcn typography style
    a: ({ className, ...props }) => (
      <a
        className={cn(
          "font-medium text-primary underline underline-offset-4",
          className
        )}
        {...props}
      />
    ),

    // Blockquote - Using shadcn typography style
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn("mt-6 border-l-2 pl-6 italic", className)}
        {...props}
      />
    ),

    // Code - Using shadcn typography styles
    code: ({ className, ...props }) => (
      <code
        className={cn(
          "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
          className
        )}
        {...props}
      />
    ),
    pre: ({ className, ...props }) => (
      <pre
        className={cn(
          "mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4",
          className
        )}
        {...props}
      />
    ),

    // Table - Using shadcn typography styles
    table: ({ className, ...props }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className={cn("w-full", className)} {...props} />
      </div>
    ),
    thead: ({ className, ...props }) => (
      <thead className={cn("", className)} {...props} />
    ),
    tbody: ({ className, ...props }) => (
      <tbody className={cn("", className)} {...props} />
    ),
    tr: ({ className, ...props }) => (
      <tr
        className={cn("m-0 border-t p-0 even:bg-muted", className)}
        {...props}
      />
    ),
    th: ({ className, ...props }) => (
      <th
        className={cn(
          "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }) => (
      <td
        className={cn(
          "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),

    // Images
    img: ({ className, alt, ...props }) => (
      <img
        className={cn("rounded-md border my-6 w-full", className)}
        alt={alt}
        {...props}
      />
    ),

    // HR
    hr: ({ ...props }) => <Separator className="my-4" {...props} />,

    // Strong and Em
    strong: ({ className, ...props }) => (
      <strong className={cn("font-semibold", className)} {...props} />
    ),
    em: ({ className, ...props }) => (
      <em className={cn("italic", className)} {...props} />
    ),

    // Additional typography variants from shadcn
    Lead: ({ className, ...props }) => (
      <p
        className={cn("text-xl text-muted-foreground", className)}
        {...props}
      />
    ),

    Large: ({ className, ...props }) => (
      <div className={cn("text-lg font-semibold", className)} {...props} />
    ),

    Small: ({ className, ...props }) => (
      <small
        className={cn("text-sm font-medium leading-none", className)}
        {...props}
      />
    ),

    Muted: ({ className, ...props }) => (
      <p
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    ),

    InlineCode: ({ className, ...props }) => (
      <code
        className={cn(
          "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
          className
        )}
        {...props}
      />
    ),

    // Custom components you can use in MDX
    Badge: ({ variant = "secondary", ...props }) => (
      <Badge variant={variant} {...props} />
    ),

    Alert: ({ className, ...props }) => (
      <Alert className={cn("my-6", className)} {...props} />
    ),

    AlertDescription: AlertDescription,

    // Custom callout component
    Callout: ({ type = "info", children, ...props }) => {
      const variants = {
        info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
        warning:
          "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100",
        error:
          "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
        success:
          "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
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
