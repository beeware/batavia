print("Hello module b")
from . import modulea

def modb():
    print("Method in module b")
    modulea.moda()
