from setuptools import setup

setup(
    name='testbank',
    version='0.1',
    packages=['interface'],
    py_modules=['testbank'],
    include_package_data=True,
    install_requires=[
        'pyyaml',
        'flask',
        'Flask-Session',
        'Flask-WTF',
    ],
    entry_points={
        'console_scripts': ['testbank=testbank:main'],
    },
)
