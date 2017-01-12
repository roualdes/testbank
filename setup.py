from setuptools import setup

setup(
    name='testbank',
    version='0.1',
    packages=['web'],
    py_modules=['testbank'],
    include_package_data=True,
    install_requires=[
        'pyyaml',
        'jinja2',
        'flask',
    ],
    entry_points={
        'console_scripts': ['testbank=testbank:main'],
    },
)
