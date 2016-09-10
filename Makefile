
ALL_FILES=\
    batavia/batavia.js \
    batavia/vendor/vendored.js \
    batavia/utils.js \
    batavia/types/Type.js \
    batavia/types/Bool.js \
    batavia/types/Bytearray.js \
    batavia/types/Bytes.js \
    batavia/types/Code.js \
    batavia/types/Complex.js \
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
    batavia/VirtualMachine.js \

ALL_FILES_WIN=\
    batavia\batavia.js \
    batavia\vendor\vendored.js \
    batavia\utils.js \
    batavia\types\Type.js \
    batavia\types\Bool.js \
    batavia\types\Bytearray.js \
    batavia\types\Bytes.js \
    batavia\types\Code.js \
    batavia\types\Complex.js \
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
    batavia\modules\dis.js \
    batavia\modules\dom.js \
    batavia\modules\marshal.js \
    batavia\modules\inspect.js \
    batavia/modules/math.js \
    batavia\modules\sys.js \
    batavia\modules\time.js \
    batavia\core\Block.js \
    batavia\core\builtins.js \
    batavia\core\Cell.js \
    batavia\core\Exception.js \
    batavia\core\Frame.js \
    batavia\core\Generator.js \
    batavia\core\PYCFile.js \
    batavia\VirtualMachine.js \

.PHONY: all clean

all: batavia.js batavia.min.js

clean:
ifeq ($(OS),Windows_NT)
	del batavia.js batavia.min.js
else
	rm batavia.js batavia.min.js
endif

batavia.js: $(ALL_FILES)
ifeq ($(OS),Windows_NT)
	type $(ALL_FILES_WIN)> batavia.js
else
	cat $(ALL_FILES) > batavia.js
endif

batavia.min.js: batavia.js
	python -m jsmin batavia.js > batavia.min.js
