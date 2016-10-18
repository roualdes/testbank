from setuptools import setup

setup(
    name='testbank',
    version='0.1',
    py_modules=['tb'],
    install_requires=[
        'pyqt5',
        'pyyaml',
        'pandas',
    ],
    entry_points={
        'console_scripts': ['testbank=tb:main'],
    },
)
