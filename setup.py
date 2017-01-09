from setuptools import setup

setup(
    name='testbank',
    version='0.1',
    py_modules=['testbank'],
    install_requires=[
        'pyyaml',
        'jinja2',
    ],
    entry_points={
        'console_scripts': ['tb=testbank:main'],
    },
)
