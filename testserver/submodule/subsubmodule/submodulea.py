print("in submodule/subsubmodule/submodulea.py")
from .. import moduleb
from ..modulec import method4
from ..moduled import method5, submoduled

def method():
    print("Calling method4 in submodule.subsubmodule.submodulea")
    moduleb.method3()
    method4()
    method5()
    submoduled.method6()