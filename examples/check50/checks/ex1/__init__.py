import check50
import numpy as np
import requests

# random seed generated and then passed to TestBank to prevent cheating
ui32 = np.iinfo(np.uint32)
seed = np.random.randint(1, ui32.max)

params = {'seed': seed, 'solution': True}
r = requests.get('http://localhost:3000/0Y7x', params=params)
sol = r.json()['solution']

@check50.check()
def exists():
    """ex1.py exists."""
    check50.exists("ex1.py")

@check50.check(exists)
def compiles():
    """ex1.py produces correct answer."""
    check50.run("python ex1.py {}".format(seed)).stdout(str(sol)+'\n').exit()
