# Word to Jekyll Post Converter

Convert your Word documents (.docx) to Jekyll blog posts automatically!

## Installation

The required library is already installed in the virtual environment.

## Usage

### Basic Usage
```bash
# Activate virtual environment
. venv/bin/activate

# Convert a Word document
python word_to_post.py your-document.docx
```

### With Options
```bash
# With custom title and tags
python word_to_post.py research.docx --title "My Research Paper" --tags "AI,machine learning,research"

# With all options
python word_to_post.py paper.docx \
  --title "5G Network Optimization" \
  --tags "5G,wireless,optimization" \
  --excerpt "New approaches to 5G network optimization" \
  --date "2026-01-07"
```

## What It Does

✅ **Converts formatting:**
- Headings (H1, H2, H3, H4)
- Bold text
- Italic text
- Code (monospace font)
- Bullet lists

✅ **Extracts images:**
- Saves images to `/images/posts/`
- Lists all extracted images

✅ **Creates Jekyll post:**
- Generates proper frontmatter
- Creates filename: `YYYY-MM-DD-title.md`
- Saves to `/_posts/` folder
- Auto-generates permalink

✅ **Provides instructions:**
- Shows file location
- Provides git commands
- Shows preview URL

## Examples

### Example 1: Simple Conversion
```bash
python word_to_post.py "My Research.docx"
```

Output:
```
✓ Post created: _posts/2026-01-07-my-research.md
```

### Example 2: With Metadata
```bash
python word_to_post.py research.docx \
  --title "Deep Learning in Wireless Networks" \
  --tags "deep learning,wireless,neural networks" \
  --excerpt "Exploring deep learning applications in wireless communications"
```

### Example 3: Multiple Documents
```bash
# Activate virtual environment once
. venv/bin/activate

# Convert multiple files
python word_to_post.py paper1.docx --tags "AI,ML"
python word_to_post.py paper2.docx --tags "5G,wireless"
python word_to_post.py paper3.docx --tags "optimization"
```

## Word Document Format Tips

For best results, format your Word document like this:

1. **First line** = Title (will be H1)
2. **Use Heading 2-4 styles** for sections
3. **Bold** for emphasis
4. **Italic** for quotes
5. **Bullet points** for lists
6. **Images** will be auto-extracted

Example Word structure:
```
My Research Title              ← Heading 1
Introduction                   ← Heading 2
This is the intro text...      ← Normal text
Methods                        ← Heading 2
• Method 1                     ← Bullet
• Method 2                     ← Bullet
Results                        ← Heading 2
The results show that...       ← Normal text
```

## After Conversion

1. **Review the post:**
   ```bash
   nano _posts/2026-01-07-your-post.md
   # or
   code _posts/2026-01-07-your-post.md
   ```

2. **If images were extracted:**
   - Check `/images/posts/` folder
   - Manually insert image references in the post:
     ```markdown
     ![Description](/images/posts/image-1.png)
     ```

3. **Preview locally:**
   ```
   http://localhost:4000/posts/2026/01/your-post/
   ```

4. **Publish:**
   ```bash
   git add _posts/2026-01-07-your-post.md
   git add images/posts/
   git commit -m "Add new blog post"
   git push
   ```

## Troubleshooting

**Q: Library not found?**
```bash
. venv/bin/activate
pip install python-docx
```

**Q: Images not showing?**
- Check if images are in `/images/posts/`
- Manually add image markdown in your post
- Make sure to commit images: `git add images/posts/`

**Q: Formatting issues?**
- The converter preserves basic formatting
- Complex tables/charts may need manual adjustment
- Review and edit the generated markdown file

## Quick Reference

```bash
# 1. Activate environment (once per session)
. venv/bin/activate

# 2. Convert document
python word_to_post.py your-file.docx --tags "tag1,tag2"

# 3. Review
code _posts/2026-01-07-your-file.md

# 4. Publish
git add _posts/*.md images/posts/
git commit -m "Add new post"
git push
```

## Notes

- The converter works with `.docx` files (Word 2007+)
- Old `.doc` files need to be converted to `.docx` first
- Title is auto-extracted from first paragraph if not provided
- Date defaults to today if not specified
- Tags are optional but recommended
