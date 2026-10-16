import json, re, os
ROOT="/home/claude/exam-revision-hub"
def T(t,subs=None,note=None): return {"title":t,"subs":subs or [],"note":note}
L=lambda *a:[T(x) if isinstance(x,str) else x for x in a]

S=[]
# ---------------- AI ----------------
S.append(dict(id="ai",name="Artificial Intelligence",short="AI",icon="🧠",code="303105307",
 desc="Broad introduction to AI: search, knowledge representation, uncertainty, fuzzy logic, NLP, neural networks and expert systems.",
 semester=5,course="BTech",credits=3,lecture=3,prereq="Data structure, Formal Languages and automata Theory, Mathematics",
 objective_label="Rationale",objective="This course provides a broad introduction to Artificial Intelligence. AI techniques for search and knowledge representation also Apply knowledge of AI planning and machine learning techniques to real-world problems.",
 chapters=[
 ("Introduction",15,7,L("Definition of an AI","Major Areas of Artificial Intelligence","AI Techniques","History of AI","AI Problems",
  T("Production Systems",note="Listed twice in syllabus (also at end of chapter); one lesson covers both."),
  T("Problem Characteristics",note="Listed twice in syllabus; one lesson covers both."),
  "Intelligent Agents","Agent Architecture",
  T("AI Application (E-Commerce & Medicine)",["E-Commerce","Medicine"]),
  "AI Representation","Properties of Internal Representation","Future Scope of AI","Issues in the Design of Search Algorithms",
  "Introduction to AI Problems and Applications","Defining Problems as a State Space Search")),
 ("Search Techniques",20,8,L("Generate-And-Test",
  T("Hill Climbing",note="Listed twice in syllabus; one lesson covers both."),
  T("Best-First Search",note="Listed twice in syllabus; one lesson covers both."),
  "Problem Reduction",
  T("Constraint Satisfaction",note="Listed twice in syllabus; one lesson covers both."),
  T("Means-Ends Analysis",note="Listed as 'Means-Ends Analysis' and 'mean and end analysis'; one lesson."),
  "Heuristic Search",T("A* and AO* Algorithm",["A* Algorithm","AO* Algorithm"]),
  "Knowledge Representation: Basic Concepts","Knowledge Representation Paradigms","Propositional Logic","Inference Rules in Propositional Logic",
  "Knowledge Representation using Predicate Logic","Predicate Calculus","Predicate and Arguments","ISA Hierarchy","Frame Notation","Resolution","Natural Deduction")),
 ("Knowledge Representation",15,8,L("Representation and Mappings","Different Approaches to Knowledge Representation","Issues in Knowledge Representation",
  T("Predicate Logic",["Representing Simple Facts in Logic","Representing Instance and Isa Relationships","Computable Functions and Predicates","Resolution"]),
  T("Propositional Logic",["Representation","Inference","Reasoning Patterns","Resolution"]),
  T("First-Order Logic",["Representation","Inference","Reasoning Patterns","Resolution"]))),
 ("Uncertainty",15,4,L("Non-Monotonic Reasoning","Logics for Non-Monotonic Reasoning",T("Forward Rules and Backward Rules",["Forward Rules","Backward Rules"]),
  "Justification Based Truth Maintenance Systems","Semantic Nets","Statistical Reasoning","Probability and Bayes' Theorem","Bayesian Network","Markov Networks","Hidden Markov Model","Basis of Utility Theory","Utility Functions")),
 ("Fuzzy Sets and Fuzzy Logic",10,5,L("Fuzzy Set Operations","Membership Functions","Fuzzy Logic","Hedges","Fuzzy Proposition and Inference Rules","Fuzzy Systems")),
 ("Natural Language Processing",10,5,L("Introduction to NLP","Syntactic Processing",T("Semantic Analysis",note="Listed twice in syllabus; one lesson covers both."),"Discourse and Pragmatic Processing","Spell Checking")),
 ("Neural Networks and Expert Systems",15,8,L("Introduction to Neural Networks","Perception-Qualitative Analysis","Neural Net Architecture and Applications","Utilization and Functionality",
  "Architecture of the Expert System","Knowledge Representation in Expert Systems","Two Case Studies on Expert Systems")),
 ]))
# ---------------- AWS ----------------
S.append(dict(id="aws",name="AWS Fundamental",short="AWS",icon="☁️",code="303105301",
 desc="Foundational AWS cloud skills: cloud basics, networking, compute, storage, databases, security, monitoring and billing.",
 semester=5,course="BTech",credits=2,lecture=2,prereq="Basics of Cloud Computing",objective_label="Course Objective",objective="Master Foundational AWS Cloud Skills",
 chapters=[
 ("Introduction to Cloud Computing and AWS",20,6,L("What is Cloud Computing?","Key Benefits of Cloud Computing","Cloud Service Models","Cloud Deployment Models","What is AWS?","The AWS Global Infrastructure")),
 ("Networking Services",15,5,L("Networking Basics","Virtual Private Cloud","Subnets","Route Tables","Security Groups","VPC Security","DNS: AWS Route 53","CloudFront","Build Your VPC in AWS and Launch a Web Server")),
 ("Compute Services",20,5,L("IaaS","Virtual Machines in the Cloud","Amazon EC2","Elastic Load Balancing","AutoScaling","Launch an Amazon EC2 Instance",
  "Serverless Computing","AWS Lambda","Characteristics of AWS Lambda","Create and Configure a Lambda Function","PaaS: AWS Elastic Beanstalk","Deploy a Sample Application to Elastic Beanstalk")),
 ("Storage Services",15,5,L(T("Object Storage, Block Storage, and File Storage",["Object Storage","Block Storage","File Storage"]),"AWS Storage Services: Amazon S3","Various Storage Classes of S3","Amazon EFS","Amazon EBS","Create an Amazon EBS Volume","Hosting a Static Website using S3")),
 ("AWS Architecture and Database Service",15,5,L("AWS Well-Architected Framework Design Principles","Relational Database Service","MySQL","PostgreSQL","SQL Server","Amazon RDS (Relational Database Service)","Amazon Aurora","Amazon DynamoDB","Amazon Redshift","Launch an Amazon RDS DB Instance")),
 ("AWS Security, Monitoring, Scaling, and Billing",15,4,L(T("Identity and Access Management",["Users","Groups","Roles","Policies"]),"AWS IAM","Implement IAM Policies","Monitoring Resources: AWS CloudWatch",
  T("Elastic Load Balancing",note="Also appears in Chapter 3 (Compute Services); kept as separate entry per syllabus."),
  T("Auto Scaling",note="Also appears in Chapter 3 (Compute Services); kept as separate entry per syllabus."),
  "Cloud Economics and Billing","Scale and Load Balance Your Architecture")),
 ]))
# ---------------- DAA ----------------
S.append(dict(id="daa",name="Design and Analysis of Algorithms",short="DAA",icon="⚡",code="303105218",
 desc="Asymptotic analysis and major algorithm design paradigms: divide & conquer, greedy, dynamic programming, graphs, backtracking, string matching and NP-completeness.",
 semester=5,course="BTech",credits=3,lecture=3,prereq="Data structures, Fundamental of programming",objective_label="Course Objective",
 objective="Analyze the asymptotic performance of algorithms. Write rigorous correctness proofs for algorithms. Demonstrate a familiarity with major algorithms and data structures. Apply important algorithmic design paradigms and methods of analysis. Synthesize efficient algorithms in common engineering design situations.",
 chapters=[
 ("Introduction and Analysis of Algorithms",20,10,L("Algorithm: Definition","Properties of Algorithms","Types of Algorithms",
  T("Writing an Algorithm",note="Syllabus text is garbled ('Writing an AlgoritAlgorithm Analysis'); read as 'Writing an Algorithm' + 'Algorithm Analysis'."),
  "Algorithm Analysis: Parameters","Design Techniques of Algorithms",
  T("Asymptotic Notations: Big Oh, Big Omega & Big Theta",["Big Oh (O)","Big Omega (Ω)","Big Theta (Θ)"]),
  "Lower Bound, Upper Bound and Tight Bound","Best Case, Worst Case, Average Case","Analyzing Control Statements","Loop Invariant and Correctness of Algorithms",
  T("Recurrences",["Substitution Method","Recursion Tree Method","Master Method"]),"Bubble Sort","Selection Sort","Insertion Sort")),
 ("Divide & Conquer Algorithms",20,6,L("Structure of Divide-and-Conquer Algorithms","Binary Search","Quick Sort","Merge Sort","Strassen Multiplication","Max-Min Problem")),
 ("Greedy Algorithms",20,8,L("Introduction to Greedy Algorithms","Elements of Greedy Strategy",T("Minimum Spanning Tree",["Kruskal's Algorithm","Prim's Algorithm"]),"Dijkstra's Algorithm","Knapsack Problem","Activity Selection Problem","Huffman Codes")),
 ("Dynamic Programming",20,8,L("Principle of Optimality","0/1 Knapsack Problem","Making Change Problem","Chain Matrix Multiplication","Longest Common Subsequence",T("All Pair Shortest Paths",["Warshall's Algorithm","Floyd's Algorithm"]))),
 ("Exploring Graphs",5,3,L("An Introduction using Graphs and Games","Undirected Graph","Directed Graph","Traversing Graphs","Depth First Search","Breadth First Search","Topological Sort")),
 ("Backtracking and Branch & Bound",5,4,L("Introduction to Backtracking","Introduction to Branch & Bound","0/1 Knapsack Problem (Backtracking / Branch & Bound)","N-Queens Problem","Travelling Salesman Problem")),
 ("String Matching & NP Completeness",10,6,L("Introduction to String Matching","Naive String Matching","Rabin-Karp Algorithm","Knuth-Morris-Pratt Algorithm","String Matching using Finite Automata",
  "Introduction to NP Completeness","P Class Problems","NP Class Problems","Hamiltonian Cycle")),
 ]))
# ---------------- EPJ ----------------
S.append(dict(id="epj",name="Enterprise Programming",short="EPJ",icon="💻",code="303105309",
 desc="Enterprise Java: JDBC and Maven, Servlets, JSP, Hibernate ORM, Spring and Spring Boot.",
 semester=5,course="BTech",credits=2,lecture=2,prereq="Basic knowledge of software applications",objective_label="Course Objective",
 objective="This course provides a broad introduction to software engineering. The various process models required to develop software is also being described. Moreover the functional and non-functional requirements are also described.",
 chapters=[
 ("Foundation of Enterprise Programming",10,3,L("JDBC","JDBC Architecture",T("JDBC with Oracle and MySQL",["JDBC with Oracle","JDBC with MySQL"]),"Maven: Integration with Eclipse","POM.xml")),
 ("Servlets",15,4,L("Basics of Web","Servlet Lifecycle","Servlets API","HTTP Servlets with XML and Annotation","Servlets Configuration","Servlets Context","Servlets Collaboration","Session Tracking","CRUD Operations (Servlets)")),
 ("JSP: Java Server Programming",15,4,L("Scripting Elements","Directive Elements","CRUD Operations (JSP)")),
 ("Hibernate (ORM)",20,6,L("Hibernate Architecture","JPA","Generator Class","Dialects","Mapping","Annotations","Transaction Management","HQL","HCQL","CRUD Operations (Hibernate)")),
 ("Spring",20,7,L("Spring Architecture","Spring Modules","Dependency Injection","Autowire","Application Context","Annotation-based Configuration","Spring MVC","CRUD Operations (Spring)")),
 ("Spring Boot",20,6,L("Dependency Injection (Spring Boot)","Web App using Spring Boot","Spring Boot AOP","Spring Boot Database","Spring Rest")),
 ]))
# ---------------- TOC ----------------
S.append(dict(id="toc",name="Theory of Computation",short="TOC",icon="📐",code="303105306",
 desc="Formal languages and automata: finite automata, regular languages, CFGs and PDAs, Turing machines and undecidability.",
 semester=5,course="BTech",credits=3,lecture=3,prereq="Calculus, Data Structures, and Algorithms",objective_label="Course Objective",
 objective="Formal Language & Automata Theory helps in natural language processing to solve a problem on a model of computation, using an algorithm. It enables to learn in which machine can be made to think.",
 chapters=[
 ("Introduction",5,2,L("Alphabet","Languages and Grammars","Productions and Derivation","Chomsky Hierarchy of Languages")),
 ("Regular Languages and Finite Automata",30,12,L("Regular Expressions and Languages","Deterministic Finite Automata (DFA) and Equivalence with Regular Expressions","Moore Machines and Mealy Machines","Conversion from Mealy to Moore and Vice Versa",
  "Nondeterministic Finite Automata (NFA) and Equivalence with DFA","Regular Grammars and Equivalence with Finite Automata","Properties of Regular Languages","Pumping Lemma for Regular Languages","Minimization of Finite Automata")),
 ("Grammars",35,15,L("Context-Free Grammars (CFG) and Languages (CFL)","Chomsky Normal Forms","Nondeterministic Pushdown Automata (PDA) and Equivalence with CFG","Parse Trees","Ambiguity in CFG","Pumping Lemma for Context-Free Languages",
  "Deterministic Pushdown Automata","Closure Properties of CFLs",T("Context-Sensitive Languages",["Context-Sensitive Grammars (CSG)","Context-Sensitive Languages"]))),
 ("Turing Machines",25,10,L("The Basic Model for Turing Machines (TM)",T("Turing-Recognizable and Turing-Decidable Languages and their Closure Properties",["Turing-Recognizable (Recursively Enumerable) Languages","Turing-Decidable (Recursive) Languages","Closure Properties"]),
  "Variants of Turing Machines","Nondeterministic TMs and Equivalence with Deterministic TMs","Unrestricted Grammars and Equivalence with Turing Machines","TMs as Enumerators")),
 ("Undecidability",5,6,L("Church-Turing Thesis","Universal Turing Machine","The Universal and Diagonalization Languages")),
 ]))

order=["ai","aws","daa","epj","toc"]
S.sort(key=lambda s: ["aws","ai","daa","epj","toc"].index(s["id"]) if False else order.index(s["id"]))
index=[];md=[]
TC=TP=TS=0
for s in S:
    chs=[];tcount=0;scount=0
    for ci,(title,w,h,topics) in enumerate(s["chapters"],1):
        cid=f'{s["id"]}-c{ci}'
        tps=[]
        for ti,t in enumerate(topics,1):
            tid=f'{cid}-t{ti:02d}'
            subs=[{"id":f'{tid}-s{si:02d}',"title":x} for si,x in enumerate(t["subs"],1)]
            e={"id":tid,"title":t["title"],"subtopics":subs}
            if t["note"]: e["syllabusNote"]=t["note"]
            tps.append(e); scount+=len(subs)
        tcount+=len(tps)
        chs.append({"id":cid,"number":ci,"title":title,"weightage":w,"teachingHours":h,"topics":tps})
    out={"id":s["id"],"name":s["name"],"code":s["code"],"chapters":chs}
    json.dump(out,open(f'{ROOT}/src/data/syllabus/{s["id"]}.json',"w"),indent=2,ensure_ascii=False)
    meta={k:s[k] for k in ["id","name","short","icon","code","desc","semester","course","credits","lecture","prereq","objective_label","objective"]}
    meta.update(chapterCount=len(chs),topicCount=tcount,subtopicCount=scount,file=f'{s["id"]}.json')
    index.append(meta); TC+=len(chs);TP+=tcount;TS+=scount
    md.append((s,chs,tcount,scount))
json.dump({"subjects":index,"totals":{"subjects":len(S),"chapters":TC,"topics":TP,"subtopics":TS}},open(f'{ROOT}/src/data/syllabus/subjects.json',"w"),indent=2,ensure_ascii=False)

# SYLLABUS.md
o=["# SYLLABUS","",f"Source: Parul University B.Tech Semester 5 syllabus screenshots (user-provided, authoritative).","",
"## Totals","","| Subject | Code | Chapters | Topics | Subtopics |","|---|---|---|---|---|"]
for s,chs,tc,sc in md: o.append(f'| {s["icon"]} {s["name"]} | {s["code"]} | {len(chs)} | {tc} | {sc} |')
o+= [f"| **TOTAL** | | **{TC}** | **{TP}** | **{TS}** |","",
"## Modelling decisions","",
"- Hierarchy: Subject → Chapter → Topic → Subtopic. **Revision lessons are attached at Topic level**; subtopics are sections inside that lesson.",
"- Each comma-separated item in the syllabus became a topic. Where the syllabus lists explicit sub-items (e.g. *Kruskal's & Prim's*), they became subtopics.",
"- Chapter titles are kept as written (only trailing colons removed).",
"- IDs are positional and stable: `ai-c2-t08`, subtopic `ai-c2-t08-s01`. Do not renumber.",
"- Topics the syllabus lists twice **inside one chapter** keep a single entry with `syllabusNote` (see list at bottom). Items repeated across *different* chapters are kept as separate entries.","",]
for s,chs,tc,sc in md:
    o+=["---","",f'## {s["icon"]} {s["name"]} ({s["code"]})',"",f'Credits {s["credits"]} · Prerequisite: {s["prereq"]}',"",f'**{s["objective_label"]}:** {s["objective"]}',""]
    for c in chs:
        o+=[f'### Chapter {c["number"]}: {c["title"]}  ',f'*Weightage {c["weightage"]}% · {c["teachingHours"]} teaching hrs · {len(c["topics"])} topics*',""]
        for t in c["topics"]:
            o.append(f'{int(t["id"].split("-t")[1][:2])}. {t["title"]} `{t["id"]}`')
            for sb in t["subtopics"]: o.append(f'    - {sb["title"]} `{sb["id"]}`')
        o.append("")
o+=["---","","## Syllabus quirks / notes","" ]
for s,chs,_,_ in md:
    for c in chs:
        for t in c["topics"]:
            if t.get("syllabusNote"): o.append(f'- `{t["id"]}` {t["title"]}: {t["syllabusNote"]}')
o+=["- AWS Ch3: 'Launch an Amazon EC2 Serverless computing' had a missing separator; read as 'Launch an Amazon EC2 Instance' + 'Serverless Computing'.",
"- AI Ch7: 'perception-qualitative Analysis' kept as written (likely means perceptron).",
"- EPJ: the screenshot shows chapters 1–6 with weightages summing to 100 and 30 teaching hours; objective text is as printed (it reads like a software-engineering objective).",
"- AI: Ch2 and Ch3 overlap (both cover knowledge representation / logic); kept as in syllabus."]
open(f'{ROOT}/SYLLABUS.md',"w").write("\n".join(o)+"\n")

# CONTENT_PROGRESS.md
p=["# CONTENT_PROGRESS","","Status values: PENDING · GENERATED · VALIDATED · NEEDS_REVIEW","",f"**Total topics: {TP} — GENERATED 0 · VALIDATED 0 · PENDING {TP}**",""]
for s,chs,tc,_ in md:
    p+=[f'## {s["name"]} — 0/{tc} generated',""]
    for c in chs:
        p+=[f'### Ch{c["number"]} {c["title"]}',"","| ID | Topic | Status |","|---|---|---|"]
        for t in c["topics"]: p.append(f'| {t["id"]} | {t["title"]} | PENDING |')
        p.append("")
open(f'{ROOT}/CONTENT_PROGRESS.md',"w").write("\n".join(p)+"\n")
print(TC,TP,TS,[(s["id"],len(c),t) for s,c,t,_ in md])
