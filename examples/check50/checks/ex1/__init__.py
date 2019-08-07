import check50
import numpy as np
import requests

# random seed generated and then passed to TestBank to prevent cheating
ui32 = np.iinfo(np.uint32)
seed = np.random.randint(1, ui32.max)

params = {'seed': seed, 'solution': True}
r = requests.get('https://testbank.roualdes.us/0Y7x', params=params)
sol = r.json()['solutions']

@check50.check()
def exists():
    """normal.py exists."""
    check50.exists("normal.py")

@check50.check(exists)
def compiles():
    """normal.py produces correct answer."""
    check50.run("python normal.py {}".format(seed)).stdout(str(sol)+'\n').exit()
