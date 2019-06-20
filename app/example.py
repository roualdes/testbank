import json
import numpy as np
from scipy.stats import norm

seed = 1234
np.random.seed(seed)
x = np.round(norm.rvs(loc=1, scale=.1, size=1), 2)

ex = 'Find $P(X > {})$.'.format(x[0])

output = json.dumps({'seed': seed, 'exercise': ex})
print(output)
