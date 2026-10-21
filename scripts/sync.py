"""Build local browser chunks and the human-readable coverage map."""
from pathlib import Path
import json
r=Path(__file__).resolve().parents[1]
d=json.loads((r/'data/course.json').read_text())
chunks=r/'data/lessons';chunks.mkdir(exist_ok=True)
keys=('id','number','order','title','subtitle','pages','group')
core={k:v for k,v in d.items() if k!='lessons'}
core['lessons']=[{k:l[k] for k in keys}for l in d['lessons']]
core['stats']={k:sum(len(l[k])for l in d['lessons'])for k in ['article','rules','vocabulary','analyses','arUr','urAr','qa','mcqs']}
(r/'data/catalogue.js').write_text('window.IRSHAD_CATALOGUE='+json.dumps(core,ensure_ascii=False,separators=(',',':'))+';\n')
for l in d['lessons']:(chunks/(l['id']+'.js')).write_text('window.IRSHAD_REGISTER('+json.dumps(l,ensure_ascii=False,separators=(',',':'))+');\n')
for p in chunks.glob('*.js'):
 if p.stem not in [l['id']for l in d['lessons']]:p.unlink()
rows=['# Source alignment and teaching coverage','','The source PDF has 403 scanned pages. This companion contains original teaching units aligned to the book topics, not a full transcription. Several source subtopics are grouped. The appendix unit teaches application; it does not reproduce or solve every source examination question. Printed page references are topic ranges; sourceNote records the samples inspected.','','| Order | Topic | Printed pages | Reading sections | Vocabulary | Analyses | Q&A | MCQs | Translation tasks |','|---|---|---|---|---|---|---|---|---|']
for l in d['lessons']:rows.append(f"|{l['order']}|{l['title']}|{l['pages'][0]}–{l['pages'][1]}|{len(l['article'])}|{len(l['vocabulary'])}|{len(l['analyses'])}|{len(l['qa'])}|{len(l['mcqs'])}|{len(l['arUr'])+len(l['urAr'])}|")
rows.extend(['','## Sample inspection notes',''])
for l in d['lessons']:rows.extend([f"### {l['order']}. {l['title']}",l['sourceNote'],''])
(r/'COVERAGE.md').write_text('\n'.join(rows)+'\n')
print(json.dumps(core['stats']))
