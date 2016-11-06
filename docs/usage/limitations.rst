JavaScript Compatibility Limitations
====================================

There are unavoidable high-level incompatibilities of some low-level Python fundamental functionality
that do not exist in JavaScript. These are not temporary issues nor are they bugs that can be fixed, but
limitations that result from the interaction between the two technologies.

These issues are detailed here.

id
---

"Return the identity of an object.
This is guaranteed to be unique among simultaneously existing objects.
(CPython uses the object's memory address.)"

This doesn't exist in JavaScript. There's no useful information that can be returned from `id` in this instance.
