# coding: utf-8

# # Publications markdown generator for academicpages
# 
# Takes a TSV of publications with metadata and converts them for use with [academicpages.github.io](academicpages.github.io). This is an interactive Jupyter notebook, with the core python code in publications.py. Run either from the `markdown_generator` folder after replacing `publications.tsv` with one that fits your format.
# 
# TODO: Make this work with BibTex and other databases of citations, rather than Stuart's non-standard TSV format and citation style.
# 

# ## Data format
# 
# The TSV needs to have the following columns: pub_date, title, venue, excerpt, citation, url_slug, paper_url, slides_url with a header at the top. 
# 
# - `excerpt` and `paper_url` can be blank, but the others must have values. 
# - `pub_date` must be formatted as YYYY-MM-DD.
# - `url_slug` will be the descriptive part of the .md file and the permalink URL for the page about the paper. The .md file will be `YYYY-MM-DD-[url_slug].md` and the permalink will be `https://[yourdomain]/publications/YYYY-MM-DD-[url_slug]`


# ## Import pandas
# 
# We are using the very handy pandas library for dataframes.

# In[2]:

import pandas as pd
import os
import glob
import re

# HTML escape function
html_escape_table = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;"
}

def html_escape(text):
    """Produce entities within text."""
    return "".join(html_escape_table.get(c,c) for c in text)


# ## Import TSV
# 
# Pandas makes this easy with the read_csv function. We are using a TSV, so we specify the separator as a tab, or `\t`.
# 
# I found it important to put this data in a tab-separated values format, because there are a lot of commas in this kind of data and comma-separated values can get messed up. However, you can modify the import statement, as pandas also has read_excel(), read_json(), and others.

# In[3]:

publications = pd.read_csv("publications.tsv", sep="\t", header=0)
publications

# ## Extract existing IDs from _publications folder
# 
# Read all markdown files in _publications and extract their IDs from YAML front matter

pub_dir = "../_publications/"
existed_IDs = set()

if os.path.exists(pub_dir):
    for filepath in glob.glob(pub_dir + "*.md"):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                # Extract ID from YAML front matter
                match = re.search(r'^ID:\s*(.+)$', content, re.MULTILINE)
                if match:
                    file_id = match.group(1).strip()
                    existed_IDs.add(file_id)
        except Exception as e:
            print(f"Warning: Could not read {os.path.basename(filepath)}: {e}")

print(f"Found {len(existed_IDs)} existing publication IDs in _publications folder")
print(f"Existing IDs: {sorted(existed_IDs)}\n")

# ## Creating the markdown files
# 
# This is where the heavy lifting is done. This loops through all the rows in the TSV dataframe, then starts to concatentate a big string (```md```) that contains the markdown for each type. It does the YAML metadata first, then does the description for the individual page.

# In[5]:

generated_count = 0
skipped_count = 0

for row, item in publications.iterrows():
    
    item_id = str(item.ID).strip()
    
    # Check if this ID already exists in _publications folder
    if item_id in existed_IDs:
        print(f"Skipping ID '{item_id}' - already exists in _publications folder")
        skipped_count += 1
        continue
    
    md_filename = str(item.ID) + ".md"
    html_filename = str(item.ID) + "-" + item.url_slug
    year = item.pub_date[:4]
    
    ## YAML variables
    
    md = "---\ntitle: \""   + item.title + '"\n'

    md += """ID: """ + str(item.ID) + "\n"

    md += """collection: publications"""
    
    md += """\npermalink: /publication/""" + html_filename
    
    # Add category
    if 'category' in item and len(str(item.category)) > 3:
        md += "\ncategory: '" + str(item.category) + "'"
    
    if len(str(item.excerpt)) > 5:
        md += "\nexcerpt: '" + html_escape(item.excerpt) + "'"
    
    md += "\ndate: " + str(item.pub_date) 
    
    md += "\nvenue: '" + html_escape(item.venue) + "'"
    
    if len(str(item.paper_url)) > 5 and str(item.paper_url) != 'nan':
        md += "\npaperurl: '" + item.paper_url + "'"
    
    if len(str(item.slides_url)) > 5 and str(item.slides_url) != 'nan' and not str(item.slides_url).startswith('#'):
        md += "\nslidesurl: '" + item.slides_url + "'"
    
    md += "\ncitation: '" + html_escape(item.citation) + "'"
    
    md += "\n---"
    
    ## Markdown description for individual page
    
    if len(str(item.excerpt)) > 5:
        md += "\n\n" + html_escape(item.excerpt) + "\n"
    
    if len(str(item.paper_url)) > 5 and str(item.paper_url) != 'nan':
        md += "\n[Download paper here](" + item.paper_url + ")\n" 
    
    if len(str(item.slides_url)) > 5 and str(item.slides_url) != 'nan' and not str(item.slides_url).startswith('#'):
        md += "\n[Download slides here](" + item.slides_url + ")\n"
        
    md += "\nRecommended citation: " + item.citation
    
    md_filename = os.path.basename(md_filename)
       
    with open("../_publications/" + md_filename, 'w') as f:
        f.write(md)
    
    generated_count += 1
    print(f"Generated: {md_filename} (ID: {item_id})")

print(f"\n=== Summary ===")
print(f"Total rows in TSV: {len(publications)}")
print(f"New files generated: {generated_count}")
print(f"Skipped (already exist): {skipped_count}")
print("Publications markdown files generated successfully!")


