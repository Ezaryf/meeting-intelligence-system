import collections
import collections.abc
import sys

# Patch for broken pyreadline in Python 3.10+
if not hasattr(collections, 'Callable'):
    collections.Callable = collections.abc.Callable

import uvicorn

if __name__ == "__main__":
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
