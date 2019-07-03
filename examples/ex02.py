import json

seed = {{ SEED }}
id = '{{ ID }}'

{{ #exercise }}
cntxt = "The majority of this class focused on Normal linear models."
qsts = ["What about them is Normal?",
        "What about them is linear?  For full points, you must be very specific about what exactly is linear.",
        "Is it possible for normal linear models to fit curves to data?  Explain."]
output = json.dumps({
    'seed': seed,
    'id': id,
    'context': cntxt,
    'questions': qsts})
print(output)
{{ /exercise }}
