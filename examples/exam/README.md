# Math 314 Exam

From within the folder `examples/exam`, and with TestBank running in a
separate terminal window, one can run

```
make
```

to compile `main.Rmd` into `main.html` for the produced exam. Some
take aways from this example

1. Exercise IDs are arbitrary and do not correspond to the numbering
   in the exam.
2. The second question in the exam makes an https request to a third
   party server to obtain a dataset.
3. The third question in the exam is produced with Python code,
   despite this being an RMarkdown document.
4. The fourth question in the exam calls a parallelized function to
   produce the output of the question.
5. I still don't know what to do with plots, so the user must deal
   with this on their end.
6. LaTeX works via MathJax, if you escape enough characters.
