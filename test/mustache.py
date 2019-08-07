import json
import numpy as np

seed = #< SEEAD >#
id = '#< ID >#'

npint = np.iinfo(np.int)
if seed is None:
    seed = np.random.randint(1, npint.max)
random.seed(seed)

#< #exercise >#
ex = "This problem has no key 'id' in the exercise schema."
output = json.dumps({'seed': seed,

                     'context': ex,
                     'questions': [],
                     'random': {}})
print(output)
#< /exercise >#
#< #solution >#
sol = "This problem's solution schema is OK."
output = json.dumps({'seed': seed,
                     'id': id,
                     'random': {},
                     'solution': sol})
print(output)
#< /solution >#
