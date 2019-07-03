import json
import numpy as np
import pandas as pd
from scipy.stats import norm

seed = {{ SEED }}
id = '{{ ID }}'

if seed is None:
    ui32 = np.iinfo(np.uint32)
    seed = np.random.randint(1, ui32.max)

np.random.seed(seed)

x = np.round(norm.rvs(loc=1, scale=0.1), 2)

{{ #exercise }}
ex = 'Find $P(X > {})$.'.format(x)

output = json.dumps({'seed': seed,
                     'id': id,
                     'context': ex,
                     'questions': []})
print(output)
{{ /exercise }}

{{ #solution }}
sol = np.round(1 - norm.cdf(x, loc=1, scale=0.1), 2)
output = json.dumps({'seed': seed,
                     'id': id,
                     'solutions': [sol]})
print(output)
{{ /solution }}
