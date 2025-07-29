#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Función para obtener los temas existentes
function getExistingTopics() {
  const contentDir = path.join(process.cwd(), 'src', 'blog-content');
  
  if (!fs.existsSync(contentDir)) {
    console.log('⚠️ Directorio blog-content no encontrado');
    return [];
  }

  const files = fs.readdirSync(contentDir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.replace('.mdx', ''));
  
  return files;
}

// Función para generar el prompt de topics
function generateTopicsPrompt() {
  const existingTopics = getExistingTopics();
  
  return `## AI Prompt: Generate Blog Topic Ideas

You are a content strategist for a Mini PC review and technology website. Generate 10-15 fresh blog article ideas about Mini PCs, small form factor computers, and related technology topics.

### Website Context:
- Focus: Mini PC reviews, comparisons, guides, and tech advice
- Audience: Tech enthusiasts, professionals, content creators, gamers
- Goal: Provide valuable, practical information about Mini PC technology

### Existing Articles (DO NOT repeat these topics):
${existingTopics.length > 0 ? existingTopics.map(topic => `- ${topic}`).join('\n') : '- No existing articles found'}

### Requirements:
- Generate completely NEW topics not covered in existing articles
- Focus on Mini PC ecosystem: hardware, software, use cases, comparisons
- Include mix of: buying guides, tutorials, comparisons, trend analysis
- Consider current tech trends: AI, remote work, content creation, gaming
- Make topics specific and actionable (not too broad)

### Output Format:
For each topic, provide:
1. **Topic Title**: Clear, engaging title
2. **Target Audience**: Who would read this
3. **Key Value**: What readers will learn/gain
4. **Suggested Slug**: filename-friendly version

Example:
**Topic**: "Mini PCs for AI Development: Local LLM Setup Guide"
**Audience**: Developers, AI enthusiasts
**Value**: Learn to run AI models locally on Mini PC hardware
**Slug**: mini-pc-ai-development-local-llm-setup

Generate your topic suggestions now:`;
}

// Función para generar el prompt de artículo
function generateArticlePrompt() {
  return `## AI Prompt: Generate SEO-Optimized MDX Article

You are a professional tech content writer. Create a complete, SEO-optimized MDX article about **[REPLACE_WITH_CHOSEN_TOPIC]**.

### CRITICAL FORMATTING RULES:
🚨 **IMPORTANT**: 
- ALWAYS start content with # (H1) heading using the article title
- Do NOT add --- separators between sections - H2 headings provide natural separation
- Use clean section breaks: H1 → intro → H2 → content → H2 → content (NO extra separators)

### Content Requirements:
- Length: 1200-2000 words
- Tone: Professional yet conversational, accessible to tech enthusiasts
- Structure: Clear hierarchy with H2 and H3 headings only
- Include: Practical examples, actionable tips, real-world applications
- Focus: Mini PC technology, comparisons, guides, or reviews
- Value: Provide genuine insights, not just keyword stuffing

### SEO Guidelines:
- Title: 50-60 characters, includes main keyword
- Meta description: 150-160 characters, compelling summary
- Tags: 4-6 relevant tags for Mini PC topics
- Keywords: Natural integration of main keyword in first paragraph
- Structure: Clear headings for readability and SEO

### Required MDX Format:

---
title: "Your SEO-Optimized Title Here (50-60 chars)"
date: "${new Date().toISOString().split('T')[0]}"
description: "Compelling meta description that includes main keyword and value proposition (150-160 chars)"
tags: ["mini-pc", "relevant-tag-2", "relevant-tag-3", "category-tag"]
---

# Your Article Title Here (Same as frontmatter title)

[Start with engaging introduction paragraph after the H1]

## First Main Section (H2)

Content for this section...

### Subsection if Needed (H3)

More detailed content...

## Second Main Section (H2)

Continue with next major topic...

## Conclusion

Wrap up with key takeaways and next steps...

### Content Structure:
1. **H1 Title** (matches frontmatter title): Clear, engaging article title
2. **Introduction** (150-200 words): Hook reader, introduce topic, preview value
3. **3-5 Main Sections** (H2): Break topic into logical parts - NO separators between them
4. **Subsections** (H3): Organize complex information when needed
5. **Conclusion** (100-150 words): Summarize and provide call-to-action

### Writing Style:
- Use "you" to address readers directly
- Active voice and strong verbs
- Vary sentence length for engagement
- Include bullet points/lists for clarity
- Smooth transitions between sections

### Mini PC Focus Areas:
- Hardware specs and performance
- Use case scenarios and applications
- Comparisons with alternatives
- Setup guides and tutorials
- Buying recommendations
- Future trends and technology

### Output Format:
🚨 **CRITICAL**: Start your response with the recommended filename, then provide the complete MDX content.

**Expected Response Structure:**
\`\`\`
**Recommended filename:** topic-keywords-here.mdx

---
title: "Article Title Here"
date: "${new Date().toISOString().split('T')[0]}"
description: "Meta description here"
tags: ["tag1", "tag2", "tag3"]
---

# Article Title Here

Content starts here...
\`\`\`

### Filename Guidelines:
- Use lowercase letters only
- Replace spaces with hyphens (-)
- Include 2-4 main keywords from the title
- Keep under 50 characters
- End with .mdx extension
- Examples: mini-pc-gaming-setup.mdx, best-mini-pc-2025.mdx

Generate the complete response now, starting with the recommended filename followed by the MDX content.`;
}

// Función principal
function main() {
  const existingTopics = getExistingTopics();
  
  console.log('🚀 Generando prompts para creación de contenido...\n');
  console.log(`📁 Encontrados ${existingTopics.length} artículos existentes\n`);
  
  // Crear directorio para prompts si no existe
  const promptsDir = path.join(process.cwd(), 'prompts');
  if (!fs.existsSync(promptsDir)) {
    fs.mkdirSync(promptsDir);
  }
  
  // Generar y guardar prompt de topics
  const topicsPrompt = generateTopicsPrompt();
  fs.writeFileSync(path.join(promptsDir, '1-generate-topics.md'), topicsPrompt);
  
  // Generar y guardar prompt de artículo
  const articlePrompt = generateArticlePrompt();
  fs.writeFileSync(path.join(promptsDir, '2-generate-article.md'), articlePrompt);
  
  console.log('✅ Prompts generados exitosamente:');
  console.log('   📄 prompts/1-generate-topics.md');
  console.log('   📄 prompts/2-generate-article.md\n');
  
  console.log('📋 Pasos a seguir:');
  console.log('1. Copia el contenido de "1-generate-topics.md" a tu IA');
  console.log('2. Elige un topic de la respuesta');
  console.log('3. Reemplaza [REPLACE_WITH_CHOSEN_TOPIC] en "2-generate-article.md"');
  console.log('4. Copia el prompt modificado a tu IA');
  console.log('5. Guarda el resultado como archivo .mdx en src/blog-content/\n');
  
  // Mostrar vista previa de topics existentes
  if (existingTopics.length > 0) {
    console.log('📚 Artículos existentes:');
    existingTopics.forEach(topic => console.log(`   - ${topic}`));
  }
}

// Ejecutar script
if (require.main === module) {
  main();
}