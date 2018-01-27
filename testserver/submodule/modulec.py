print("in submodule/modulec.py")
from . import modulea

def method4():
    print("Calling method in submodule.modulec")
    modulea.method2()
