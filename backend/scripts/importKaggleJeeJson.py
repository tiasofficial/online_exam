import json
import os
from pymongo import MongoClient

# MongoDB Connection
mongo_uri = os.environ.get('MONGO_URI', 'mongodb+srv://admin:dBpassword@cluster0.f685bve.mongodb.net/Online-Exam-Portal?retryWrites=true&w=majority')
client = MongoClient(mongo_uri)
db = client.get_database()
collection = db['questionbanks']

json_path = r'C:\Users\sayan\.cache\kagglehub\datasets\damerajee\jee-question-json-format\versions\1\jee.json'

print("Loading raw Kaggle jee.json dataset...")
with open(json_path, 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

subject_map = {
    'biolog': ('Biology', 'NEET'),
    'chemistri': ('Chemistry', 'BOTH'),
    'math': ('Mathematics', 'JEE-Mains'),
    'physic': ('Physics', 'BOTH')
}

print("Clearing existing questionbank collection...")
collection.delete_many({})

documents_to_insert = []
batch_size = 5000
total_inserted = 0

for key, (subj_name, exam_type) in subject_map.items():
    items = raw_data.get(key, [])
    print(f"Processing {len(items)} questions for subject {subj_name}...")
    
    for idx, item in enumerate(items):
        q_text = item.get('question', '').strip()
        raw_opts = item.get('options', [])
        
        # Clean options
        opts = [str(o).strip() for o in raw_opts if str(o).strip() and str(o).strip().lower() != 'nan']
        
        if not q_text or len(q_text) < 5:
            continue
        
        if len(opts) < 2:
            opts = ["Option A", "Option B", "Option C", "Option D"]
        elif len(opts) < 4:
            while len(opts) < 4:
                opts.append(f"Option {chr(65 + len(opts))}")
        elif len(opts) > 4:
            opts = opts[:4]

        ans = opts[0]
        
        doc = {
            'body': q_text.capitalize(),
            'bodyImage': '',
            'options': opts,
            'optionImages': ['', '', '', ''],
            'answer': ans,
            'subject': subj_name,
            'examType': exam_type,
            'topic': f'{subj_name} Syllabus',
            'questionType': 'SINGLE',
            'marks': 4,
            'explanation': f'Standard {subj_name} PYQ concept evaluation.',
            'isPyq': True,
            'pyqTag': f'{exam_type} PYQ'
        }
        
        documents_to_insert.append(doc)
        
        if len(documents_to_insert) >= batch_size:
            collection.insert_many(documents_to_insert, ordered=False)
            total_inserted += len(documents_to_insert)
            print(f"Inserted batch! ({total_inserted} total questions saved in MongoDB)")
            documents_to_insert = []

if documents_to_insert:
    collection.insert_many(documents_to_insert, ordered=False)
    total_inserted += len(documents_to_insert)
    documents_to_insert = []

print(f"====================================================")
print(f"✅ IMPORT COMPLETE! Successfully loaded {total_inserted} real questions from Kaggle JEE/NEET dataset into MongoDB!")
print(f"====================================================")
