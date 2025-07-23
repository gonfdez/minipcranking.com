# 🖥️ Content Creation Guide for Mini PCs Website (MDX + SEO)

This guide describes the step-by-step process to create and publish SEO-optimized MDX articles about mini PCs for our Next.js website.

---

## ✅ Step 1: Keyword Research (FREE Tools)

1. Use **Google Keyword Planner** to find high-traffic keywords.
2. Complement with:
   - **AnswerThePublic:** https://answerthepublic.com/
   - **AlsoAsked:** https://alsoasked.com/
   - **Keyword Surfer (Chrome Extension)**

3. Identify:
   - Primary keyword (main topic)
   - Secondary/related keywords
   - User search intent (e.g., buying guide, comparison, reviews)

---

## ✅ Step 2: Content Generation with AI

1. Use AI to generate the base article.
2. Prompt template:

```txt
## Instructions for AI:

You are a professional content writer creating SEO-optimized blog articles. Generate a complete MDX article about **[TOPIC]** following these specifications:

### Content Requirements:
- Write an engaging, informative article of 1200-2000 words
- Use clear, conversational tone suitable for general audiences
- Structure content with proper headings (H2, H3) for readability
- Include practical examples, tips, or actionable insights
- Ensure content is original, accurate, and valuable to readers
- Focus on providing genuine value rather than keyword stuffing

### SEO Optimization:
- Create an compelling title (50-60 characters) that includes the main keyword
- Write a meta description (150-160 characters) that summarizes the article's value
- Use relevant tags (3-7 tags) that represent the article's topics and categories
- Include the main keyword naturally in the first paragraph
- Use semantic keywords and related terms throughout the content
- Structure content with clear headings for better readability

### Technical Format:
- Return ONLY the MDX content in plain text format
- Start with frontmatter metadata using the exact format below
- Use proper markdown syntax (#, ##, ###, etc.)
- Include no code blocks, just the raw MDX content ready to copy-paste

### Required Frontmatter Format:

---
title: "Your SEO-Optimized Title Here"
description: "Compelling meta description that summarizes the article's value and includes main keyword"
tags: ["primary-tag", "secondary-tag", "relevant-topic", "category"]
---


### Suggested File Naming:
Provide the recommended slug/filename in this format: `topic-main-keywords.mdx`
(Use lowercase, hyphens instead of spaces, include 2-4 main keywords from the title)

### Content Structure Guidelines:
1. **Introduction** (150-200 words): Hook the reader, introduce the topic, preview what they'll learn
2. **Main Sections** (3-5 sections with H2 headings): Break down the topic into digestible parts
3. **Subsections** (H3 headings as needed): Further organize complex information
4. **Practical Examples**: Include real-world applications or case studies when relevant
5. **Conclusion** (100-150 words): Summarize key points and provide next steps or call-to-action

### Writing Style:
- Use active voice and strong verbs
- Write in second person ("you") to directly address the reader
- Include transition phrases for smooth flow between sections
- Vary sentence length for engaging rhythm
- Use bullet points or numbered lists when appropriate for clarity
```

---

## ✅ Step 3: SEO and Style Optimization (Manual)

- [ ] Confirm the **primary keyword** is present in:
  - Title (H1)
  - First paragraph
  - At least one H2 heading
- [ ] Use **related keywords** naturally.
- [ ] Add internal links to other articles/pages.
- [ ] Add external links to reputable sources.
- [ ] Include alt text for images.
- [ ] Use a **meta description** (write one manually if needed).

### Tools to Assist:
- **Grammarly (Free):** for grammar and clarity.
- **Hemingway App:** for readability.
- **Lighthouse (Chrome DevTools):** to audit SEO and accessibility.
- **Google Search Console:** after publishing to monitor performance.

---

## ✅ Step 4: Publish and Monitor

1. Commit the MDX file to the repository.


2. Deploy the Next.js site.


3. Check indexing and performance on Google Search Console.


4. Optionally, re-audit with Lighthouse post-deployment.


---

## ✅ Bonus Tips

Refresh articles every 6-12 months for relevance.

Track keyword rankings with free tools like Ubersuggest (limited free use).

Continuously interlink new content.


> Reminder: Always write for humans first, then optimize for search engines.

