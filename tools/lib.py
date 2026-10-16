import json,os
Q=lambda t,q,a,e="",o=None:{"type":t,"question":q,"answer":a,"explanation":e,**({"options":o} if o else {})}
E=lambda t,q,a:{"type":t,"question":q,"answer":a}
CMP=lambda title,h,rows:{"title":title,"headers":h,"rows":rows}
ROOT="/home/claude/exam-revision-hub/src/data/content/"
def L(id,title,imp,defn,simple,analogy,example,key,must,know,mist,exq,kc,quick,**x):
    assert len(kc)>=5,(id,"kc");assert len(key)>=4,(id,"key")
    return dict(id=id,title=title,importance=imp,definition=defn,simpleExplanation=simple,realLifeAnalogy=analogy,example=example,keyPoints=key,mustKnow=must,ifYouKnow=know,commonMistakes=mist,examQuestions=exq,knowledgeCheck=kc,quickRevision=quick,**x)
def save(subj,T):
    f=ROOT+subj+".json";cur=json.load(open(f)) if os.path.exists(f) else {}
    for t in T:cur[t["id"]]=t
    json.dump(cur,open(f,"w"),indent=1,ensure_ascii=False);print(subj,len(T),"written; total",len(cur))
