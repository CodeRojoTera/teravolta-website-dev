#!/bin/bash
# Fix the ManualProjectWizard.tsx key prop
# Find the line with map((phase, idx) and key={idx} and fix it

python3 << 'PYTHON'
import re

with open('Development/components/ManualProjectWizard.tsx', 'r') as f:
    content = f.read()

# Replace the mapping function
content = re.sub(
    r"\.map\(\(phase, idx\) => \(",
    ".map((phase) => (",
    content
)

# Replace the key prop
content = re.sub(
    r'key=\{idx\}',
    'key={phase.id}',
    content
)

with open('Development/components/ManualProjectWizard.tsx', 'w') as f:
    f.write(content)

print("Fixed!")
PYTHON
