# from here ...
import requests
import sys
import numpy as np
from scipy.stats import norm

seed = int(sys.argv[1])
params = {'seed': seed}
r = requests.get('http://localhost:3000/0Y7x', params=params)
ex = r.json()
X = ex['random']['X']

# ... until here can be boilerplate that students are provided
# they provide a solution and print it

p = 1 - norm.cdf(X, 1, 0.1)
print(np.round(p, 2))
