
BASE_FILES=\
    batavia/batavia.js \
    batavia/vendor/vendored.js \
    batavia/utils.js \
    batavia/types/Type.js \
    batavia/types/Bool.js \
    batavia/types/Bytearray.js \
    batavia/types/Bytes.js \
    batavia/types/Code.js \
    batavia/types/Complex.js \
    batavia/types/JSDict.js \
    batavia/types/Dict.js \
    batavia/types/DictView.js \
    batavia/types/Ellipsis.js \
    batavia/types/Filter.js \
    batavia/types/Float.js \
    batavia/types/Function.js \
    batavia/types/Int.js \
    batavia/types/List.js \
    batavia/types/Map.js \
    batavia/types/Module.js \
    batavia/types/NoneType.js \
    batavia/types/NotImplementedType.js \
    batavia/types/Range.js \
    batavia/types/Set.js \
    batavia/types/SetIterator.js \
    batavia/types/Slice.js \
    batavia/types/FrozenSet.js \
    batavia/types/Str.js \
    batavia/types/Tuple.js \
    batavia/modules/_compile/_compile.js \
    batavia/modules/_compile/bitset.js \
    batavia/modules/_compile/grammar.js \
    batavia/modules/_compile/tokenizer.js \
    batavia/modules/dis.js \
    batavia/modules/dom.js \
    batavia/modules/marshal.js \
    batavia/modules/inspect.js \
    batavia/modules/math.js \
    batavia/modules/sys.js \
    batavia/modules/time.js \
    batavia/core/Block.js \
    batavia/core/builtins.js \
    batavia/core/Cell.js \
    batavia/core/Exception.js \
    batavia/core/Frame.js \
    batavia/core/Generator.js \
    batavia/core/PYCFile.js \
    batavia/VirtualMachine.js

BASE_FILES_WIN=\
    batavia\batavia.js \
    batavia\vendor\vendored.js \
    batavia\utils.js \
    batavia\types\Type.js \
    batavia\types\Bool.js \
    batavia\types\Bytearray.js \
    batavia\types\Bytes.js \
    batavia\types\Code.js \
    batavia\types\Complex.js \
    batavia\types\JSDict.js \
    batavia\types\Dict.js \
    batavia\types\DictView.js \
    batavia\types\Ellipsis.js \
    batavia\types\Filter.js \
    batavia\types\Float.js \
    batavia\types\Function.js \
    batavia\types\Int.js \
    batavia\types\List.js \
    batavia\types\Map.js \
    batavia\types\Module.js \
    batavia\types\NoneType.js \
    batavia\types\NotImplementedType.js \
    batavia\types\Range.js \
    batavia\types\Set.js \
    batavia\types\SetIterator.js \
    batavia\types\Slice.js \
    batavia\types\FrozenSet.js \
    batavia\types\Str.js \
    batavia\types\Tuple.js \
    batavia\modules\_compile\_compile.js \
    batavia\modules\_compile\bitset.js \
    batavia\modules\_compile\grammar.js \
    batavia\modules\_compile\tokenizer.js \
    batavia\modules\dis.js \
    batavia\modules\dom.js \
    batavia\modules\marshal.js \
    batavia\modules\inspect.js \
    batavia\modules\math.js \
    batavia\modules\sys.js \
    batavia\modules\time.js \
    batavia\core\Block.js \
    batavia\core\builtins.js \
    batavia\core\Cell.js \
    batavia\core\Exception.js \
    batavia\core\Frame.js \
    batavia\core\Generator.js \
    batavia\core\PYCFile.js \
    batavia\VirtualMachine.js

EXTRA_FILES=\
		batavia/modules/misc.js \
		batavia/modules/stdlib/_weakrefset.js \
		batavia/modules/stdlib/abc.js \
		batavia/modules/stdlib/bisect.js \
		batavia/modules/stdlib/colorsys.js \
		batavia/modules/stdlib/copyreg.js \
		batavia/modules/stdlib/token.js \
		batavia/modules/stdlib/operator.js \
		batavia/modules/stdlib/stat.js \
		batavia/modules/stdlib/this.js

EXTRA_FILES_WIN=\
		batavia\modules\misc.js \
		batavia\modules\stdlib\_weakrefset.js \
		batavia\modules\stdlib\abc.js \
		batavia\modules\stdlib\bisect.js \
		batavia\modules\stdlib\colorsys.js \
		batavia\modules\stdlib\copyreg.js \
		batavia\modules\stdlib\token.js \
		batavia\modules\stdlib\operator.js \
		batavia\modules\stdlib\stat.js \
		batavia\modules\stdlib\this.js


all: stdlib batavia-all.js batavia-all.min.js batavia.js batavia.min.js

.PHONY: all clean stdlib

stdlib:
	python compile_stdlib.py

clean:
ifeq ($(OS),Windows_NT)
	del batavia-all.js batavia-all.min.js batavia.js batavia.min.js
else
	rm batavia-all.js batavia-all.min.js batavia.js batavia.min.js
endif

batavia.js: $(BASE_FILES)
ifeq ($(OS),Windows_NT)
	type $(BASE_FILES_WIN)> batavia.js
else
	cat $(BASE_FILES) > batavia.js
endif

batavia-all.js: $(EXTRA_FILES) batavia.js stdlib
ifeq ($(OS),Windows_NT)
	type batavia.js $(EXTRA_FILES_WIN)> batavia-all.js
else
	cat batavia.js $(EXTRA_FILES) > batavia-all.js
endif


batavia.min.js: batavia.js
	python -m jsmin batavia.js > batavia.min.js

batavia-all.min.js: batavia-all.js
	python -m jsmin batavia-all.js > batavia-all.min.js
