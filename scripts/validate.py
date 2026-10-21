"""Content integrity checks; grammar is also reviewed editorially."""
from pathlib import Path
import json,re
r=Path(__file__).resolve().parents[1];d=json.loads((r/'data/course.json').read_text());ls=d['lessons']
assert len(ls)==51 and len({l['id']for l in ls})==51
assert [l['order']for l in ls]==list(range(1,52))
assert all(ls[i]['pages'][0]<=ls[i+1]['pages'][0] for i in range(50))
assert ls.index(next(l for l in ls if l['number']==13))<ls.index(next(l for l in ls if l['number']==12))
assert ls.index(next(l for l in ls if l['number']==27))<ls.index(next(l for l in ls if l['number']==26))
counts={k:0 for k in ['article','rules','vocabulary','analyses','arUr','urAr','qa','mcqs']}
for l in ls:
 assert l['pages'][0]>0 and l['pages'][1]<=400 and l['pages'][0]<=l['pages'][1]
 assert len(l['objectives'])>=3 and l['sourceNote']
 for k in counts:assert len(l[k])>=2;counts[k]+=len(l[k])
 for a in l['article']:
  assert 45<=len(a['text'].split())<=130,(l['id'],'paragraph length')
 for w in l['vocabulary']:
  assert w['pos']in ['اسم','فعل','حرف','ترکیب','جملہ'] and w['detail'] and w['en'] and w['ur']
 for a in l['analyses']:
  assert a['sentence'].rstrip('.۔!؟').split()==[t['ar'].rstrip('.۔!؟')for t in a['tokens']],(l['id'],a['sentence'])
  assert len(a['assembly'])>=2 and a['conclusion']
 for q in l['mcqs']:
  assert len(q['options'])==len(set(q['options']))==4 and type(q['correct'])is int and 0<=q['correct']<4 and q['explanation']
 # Arabic-designated fields must contain vowel marks and exclude Urdu-only letters.
 fields=[l['article'][i]['arabic']for i in range(len(l['article']))]+[x['ar']for x in l['vocabulary']]+[a['sentence']for a in l['analyses']]+[x['prompt']for x in l['arUr']]+[x['answer']for x in l['urAr']]+[x['arabic']for x in l['qa']]
 fields += [x['arabic']for x in l['rules']] + [x['arabic']for x in l['mcqs']if x['arabic']]
 for text in fields:
  words=re.findall(r'[\u0621-\u063a\u0641-\u064a\u064b-\u065f\u0670]+',text)
  assert all(len(w)<=1 or re.search('[\u064b-\u065f\u0670]',w)for w in words),(l['id'],'unmarked Arabic word',text)
  assert re.search('[\u064b-\u065f\u0670]',text),(l['id'],'unmarked Arabic',text)
  assert not re.search('[ٹپچڈڑژگںھہے]',text),(l['id'],'Urdu in Arabic field',text)
 for k in ['article','rules','vocabulary','analyses','arUr','urAr','qa','mcqs']:
  assert 'undefined'not in json.dumps(l[k]),(l['id'],k)
for p in (r/'data/lessons').glob('*.js'):
 v=json.loads(p.read_text()[len('window.IRSHAD_REGISTER('):-3]);assert v==next(l for l in ls if l['id']==p.stem)
assert len(list((r/'data/lessons').glob('*.js')))==51
assert not list(r.rglob('*.pdf'))
print(json.dumps({'lessons':len(ls),'sourceOrder':'PASS','contentIntegrity':'PASS','counts':counts}))
